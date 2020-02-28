import React from 'react';
import { withRouter, Link, Redirect } from 'react-router-dom'
import { RouteComponentProps } from 'react-router';

import { Column, List, Title, PageLoader } from 'rbx';

interface AnimeId {
  animeId: string;
}

type LocationState = {
  anime: any;
}

interface IEpisode {
  items: Array<any>;
  meta: Array<any>;
  links: Array<any>;
  indexFirstView: boolean;
  isLoading: boolean;
}

interface ComponentProps extends RouteComponentProps<AnimeId> {}

class AnimeStreaming extends React.Component<ComponentProps, IEpisode, LocationState> {

  constructor(props: any) {
    super(props);
    this.state = {
      items: [{
        link: '#'
      }],
      meta: [],
      links: [],
      indexFirstView: false,
      isLoading: true,
    }
  }

  componentDidMount() {
    const animeId = this.props.match.params.animeId;
    window.fetch(`https://api.id-anime.net/v1/animes/${animeId}/episodes`)
      .then((response: any) => {
        response.json().then((data: any) => {
          console.log(data);
          this.setState({
            items: data.items,
            indexFirstView: true,
            isLoading: false,
          });
        });
      });
  }

  renderStreamingIframe(episodeIndex: number) {
    const animeEpisodes = this.state.items;
    return (
      <iframe className='video-iframe' title='anime-streaming' frameBorder={0} src={animeEpisodes[episodeIndex].link} allowFullScreen />
    )
  }

  render() {
    const animeEpisodes = this.state.items;
    let anime = {
      title: ''
    }

    if ((typeof this.props.location.state == 'undefined') || (Object.keys(this.props.location.state).length === 0)) {
      return (<Redirect to='/' />);
    } else {
      // @ts-ignore
      anime = this.props.location.state.anime;
    }

    return (
      <div className='body-container'>
        {this.state.isLoading ? <PageLoader color='light' active={this.state.isLoading}>
          <Title>Loading ...</Title>
        </PageLoader> :
          <Column size='three-fifths' offset='one-fifth' height='380px'>
            <Title size={3} as='h1'>{anime.title}</Title>
            <Title size={4} as='h2'>Episode {animeEpisodes[0].episode}: {animeEpisodes[0].title}</Title>

            {this.renderStreamingIframe(0)}

            <br />

            <Title size={5} as='h3'>Episode</Title>

            <List>
              {animeEpisodes.map(episode => (
                <Link to={{
                  pathname: '/animes/' + this.props.match.params.animeId + '/episodes/' + episode.id,
                  state: {
                    anime: anime,
                    episode: episode
                  }
                }}><List.Item>Episode {episode.episode}</List.Item></Link>
              ))}

            </List>
          </Column>
        }
      </div>
    )
  }
}

export default withRouter(AnimeStreaming);
