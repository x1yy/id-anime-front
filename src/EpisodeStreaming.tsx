import React from 'react';
import { withRouter, Link } from 'react-router-dom'
import { RouteComponentProps } from 'react-router';

import { Column, List, Title, PageLoader } from 'rbx';

interface AnimeId {
  animeId: string;
  episodeId: string;
}

interface IAnime {
  id: number;
  title: string;
  synopsis: string;
  metaDescription: string;
  coverLink: string;
}

interface IEpisode {
  id: number;
  link: string;
  episode: number;
  title: string;
  synopsis: string;
  anime: IAnime;
  animeEpisodes: any;
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
        id: 0,
        title: '',
        synopsis: '',
        metaDescription: '',
        coverLink: ''
      },
      animeEpisodes: {
        items: []
      },
      indexFirstView: false,
      isLoading: true
    }
  }

  componentDidMount() {
    if (typeof this.props.location.state == 'undefined') {
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
        window.fetch(`https://api.id-anime.net/v1/animes/${animeId}`)
          .then((response: any) => {
            response.json().then((data: any) => {
              this.setState({
                anime: {
                  id: data.id,
                  title: data.title,
                  synopsis: data.synopsis,
                  metaDescription: data.metaDescription,
                  coverLink: data.coverLink
                }
              });
            });
          });
      } else {
        // @ts-ignore
        const episode = this.props.location.state.episode;
        // @ts-ignore
        const anime = this.props.location.state.anime;

        this.setState({
          id: episode.id,
          link: episode.link,
          episode: episode.episode,
          title: episode.title,
          synopsis: episode.synopsis,
          anime: anime,
          indexFirstView: true,
          isLoading: false
        })
      }

      const animeId = this.props.match.params.animeId;
      window.fetch(`https://api.id-anime.net/v1/animes/${animeId}/episodes`)
        .then((response: any) => {
          response.json().then((data: any) => {
            console.log(data);
            this.setState({
              animeEpisodes: data,
              isLoading: false
            });
          });
        });

  }

  renderStreamingIframe() {
    return (
      <iframe className='video-iframe' title='anime-streaming' frameBorder={0} src={this.state.link} allowFullScreen />
    )
  }

  render() {
    const animeEpisodes = this.state.animeEpisodes.items;
    return (
      <div className='body-container'>
        {this.state.isLoading ? <PageLoader color='light' active={this.state.isLoading}>
          <Title>Loading ...</Title>
        </PageLoader> :
        <Column size='three-fifths' offset='one-fifth' height='380px'>

          <Title size={3} as='h1'>{this.state.anime.title}</Title>
          <Title size={4} as='h2'>Episode {this.state.episode}: {this.state.title}</Title>

          {this.renderStreamingIframe()}

          <br />

          <Title size={4} as='h1'>Episode</Title>

          <List>
            {animeEpisodes.map((episode: any) => (
              <Link to={{
                pathname: '/animes/' + this.props.match.params.animeId + '/episodes/' + episode.episode,
                state: {
                  anime: this.state.anime,
                  episode: episode
                }
              }}
              ><List.Item>Episode {episode.episode}</List.Item></Link>
            ))}

          </List>
        </Column>
        }
      </div>
    )
  }
}

export default withRouter(EpisodeStreaming);
