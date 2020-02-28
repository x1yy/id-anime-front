import React from 'react';
import { withRouter, Link } from 'react-router-dom'
import { RouteComponentProps } from 'react-router';

import { Column, List, Title } from 'rbx';

interface AnimeId {
  animeId: string;
  episodeId: string;
}

interface IEpisode {
  id: number;
  link: string;
  episode: number;
  title: string;
  synopsis: string;
  anime: any;
  indexFirstView: boolean;
  isLoading: boolean;
}

interface ComponentProps extends RouteComponentProps<AnimeId> {}

class EpisodeStreaming extends React.Component<ComponentProps, IEpisode> {

  constructor(props: any) {
    super(props);
    this.state = {
      id: 0,
      link: '#',
      episode: 0,
      title: '',
      synopsis: '',
      anime: {
        items: []
      },
      indexFirstView: false,
      isLoading: true
    }
  }

  componentDidMount() {
    const episodeId = this.props.match.params.episodeId;
    window.fetch(`https://api.id-anime.net/v1/episodes/${episodeId}`)
      .then((response: any) => {
        response.json().then((data: any) => {
          console.log(data);
          this.setState({
            id: data.id,
            link: data.link,
            episode:data.episode,
            title: data.title,
            synopsis: data.synopsis,
            indexFirstView: true,
            isLoading: false
          });
        });
      });

      const animeId = this.props.match.params.animeId;
      window.fetch(`https://api.id-anime.net/v1/animes/${animeId}/episodes`)
        .then((response: any) => {
          response.json().then((data: any) => {
            console.log(data);
            this.setState({
              anime: data
            });
          });
        });
  }

  renderStreamingIframe() {
    return (
      <iframe className='video-iframe' frameBorder={0} src={this.state.link} allowFullScreen />
    )
  }

  render() {
    const animeEpisodes = this.state.anime.items;
    return (
      <div className='body-container'>
        {this.state.isLoading ? <PageLoader color='light' active={this.state.isLoading}>
          <Title>Loading ...</Title>
        </PageLoader> :
        <Column size='three-fifths' offset='one-fifth' height='380px'>
          {this.renderStreamingIframe()}

          <br />

          <Title size={4} as='h1'>Episode</Title>

          <List>
            {animeEpisodes.map((episode: any) => (
              <Link to={'/animes/' + this.props.match.params.animeId + '/episodes/' + episode.episode}><List.Item>Episode {episode.episode}</List.Item></Link>
            ))}

          </List>
        </Column>
        }
      </div>
    )
  }
}

export default withRouter(EpisodeStreaming);
