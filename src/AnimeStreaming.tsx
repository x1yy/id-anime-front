import React from 'react';
import { withRouter, Link, Redirect } from 'react-router-dom'
import { RouteComponentProps } from 'react-router';
import * as queryString from 'query-string';

import { Column, List, Title, PageLoader, Pagination } from 'rbx';

interface AnimeId {
  animeId: string;
}

type LocationState = {
  anime: any;
}

interface IEpisode {
  anime: any;
  data: any;
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
      anime: {},
      data: {
        meta: {},
        items: [],
        links: {},
      },
      items: [{
        link: '#'
      }],
      meta: [],
      links: [],
      indexFirstView: false,
      isLoading: true,
    };
  }

  componentDidMount() {
    if (typeof this.props.location.state == 'undefined') {
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
      const anime = this.props.location.state.anime;

      this.setState({anime: anime});
    }

    const animeId = this.props.match.params.animeId;
    let link = `https://api.id-anime.net/v1/animes/${animeId}/episodes`;
    if (this.props.location.search) {
      const qs = queryString.parse(this.props.location.search);
      link = `https://api.id-anime.net/v1/animes/${animeId}/episodes?page=${qs.page}&limit=12`;
    }
    window.fetch(link)
      .then((response: any) => {
        response.json().then((data: any) => {
          console.log(data);
          this.setState({
            data: data,
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
    const anime = this.state.anime;

    const animeId = this.props.match.params.animeId;
    let previousLink = '';
    // @ts-ignore
    if (this.state.data.links.previous) {
      // @ts-ignore
      const previousPage = parseInt(this.state.data.meta.currentPage) - 1;
      previousLink = `/animes/${animeId}?page=${previousPage}`;
    }

    // @ts-ignore
    let nextPage = parseInt(this.state.data.meta.currentPage) + 1;
    let nextLink = `/animes/${animeId}?page=${nextPage}`;

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
              <List.Item>
                <Pagination align='centered'>
                  <Pagination.Step align='previous' href={previousLink}>sebelumnya</Pagination.Step>
                  <Pagination.Step align='next' href={nextLink}>selanjutnya</Pagination.Step>
                </Pagination>
              </List.Item>
            </List>
          </Column>
        }
      </div>
    )
  }
}

export default withRouter(AnimeStreaming);
