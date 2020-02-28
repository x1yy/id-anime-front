import React from 'react';
import { Link } from 'react-router-dom';
import {
  Container, Card, Image, Column, PageLoader, Pagination, Title
} from 'rbx';
import * as queryString from 'query-string';

import './App.css';

interface IItem {
  id: number;
  coverLink: string;
  title: string;
}

interface IState {
  collection: any;
  items: IItem[];
  isLoading: boolean;
}

export class AnimeCollection extends React.Component<any, IState> {

  state = {
    collection: {},
    items: [{
      id: 0,
      coverLink: '#',
      title: '#'
    }],
    isLoading: true
  }

  constructor(props: any) {
    super(props);
    this.state.items = [{
      id: 0,
      coverLink: '#',
      title: '#'
    }];
    this.state.collection = {
      items: [],
      meta: {},
      links: {}
    };
    this.state.isLoading = true;
  }

  componentDidMount() {
    let link = 'https://api.id-anime.net/v1/animes';
    if (this.props.location.search) {
      const qs = queryString.parse(this.props.location.search);
      link = `https://api.id-anime.net/v1/animes?page=${qs.page}&limit=12`;
    }
    window.fetch(link)
      .then((response: any) => {
        response.json().then((data: any) => {
          console.log(data);
          this.setState({
            collection: data,
            items: data.items,
            isLoading: false
          });
        });
      });
  }

  render() {
    const collections = this.state.items;

    let previousLink = '';
    // @ts-ignore
    if (this.state.collection.links.previous) {
      // @ts-ignore
      const previousPage = parseInt(this.state.collection.meta.currentPage) - 1;
      previousLink = `/?page=${previousPage}`;
    }

    // @ts-ignore
    let nextPage = parseInt(this.state.collection.meta.currentPage) + 1;
    let nextLink = `/?page=${nextPage}`;

    return (
      <div className='body-container'>
        <Container>
          <Column.Group vcentered multiline gapSize={8} className='anime-grid'>
            {this.state.isLoading ? <PageLoader color='light' active={this.state.isLoading}>
                <Title>Loading ...</Title>
              </PageLoader> : collections.map(collection => (
              <Column size='one-quarter' key={collection.id}>
                <Link to={{
                  pathname: '/animes/' + collection.id,
                  state: {
                    anime: collection
                  }
                }}>
                  <Card>
                    <Card.Image>
                      <Image.Container size='3by4'>
                        <Image src={collection.coverLink} />
                      </Image.Container>
                    </Card.Image>
                    <Card.Content>
                      {collection.title}
                    </Card.Content>
                  </Card>
                </Link>
              </Column>
            ))}

            <Column>
              <Pagination align='centered'>
                <Pagination.Step align='previous' href={previousLink}>sebelumnya</Pagination.Step>
                <Pagination.Step align='next' href={nextLink}>selanjutnya</Pagination.Step>
                <Pagination.List>
                  <Pagination.Link>1</Pagination.Link>
                </Pagination.List>
              </Pagination>
            </Column>
          </Column.Group>
        </Container>
      </div>
    );
  }
}
