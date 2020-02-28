import React from 'react';
import { withRouter, Link } from 'react-router-dom'
import { RouteComponentProps } from 'react-router';

import { Column, List, Title, PageLoader } from 'rbx';

interface AnimeId {
  animeId: string;
}

interface IEpisode {
  items: Array<any>;
  meta: Array<any>;
  links: Array<any>;
  indexFirstView: boolean;
  isLoading: boolean;
}

interface ComponentProps extends RouteComponentProps<AnimeId> {}

class AnimeStreaming extends React.Component<ComponentProps, IEpisode> {

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
      <iframe className='video-iframe' frameBorder={0} src={animeEpisodes[episodeIndex].link} allowFullScreen />
    )
  }

  render() {
    const animeEpisodes = this.state.items;

    return (
      <div className='body-container'>
        {this.state.isLoading ? <PageLoader color='light' active={this.state.isLoading}>
          <Title>Loading ...</Title>
        </PageLoader> :
          <Column size='three-fifths' offset='one-fifth' height='380px'>
            {this.renderStreamingIframe(0)}

            <br />

            <Title size={4} as='h1'>Episode</Title>

            <List>
              {animeEpisodes.map(episode => (
                <Link to={'/animes/' + this.props.match.params.animeId + '/episodes/' + episode.id}><List.Item>Episode {episode.episode}</List.Item></Link>
              ))}

            </List>
          </Column>
        }
      </div>
    )
  }
}

export default withRouter(AnimeStreaming);
