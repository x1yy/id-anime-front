import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Card, Image, Column } from 'rbx';

import './App.css';

interface IItem {
  id: number;
  coverLink: string;
  title: string;
}

interface IState {
  collection: any;
  items: IItem[];
}

export class AnimeCollection extends React.Component<any, IState> {

  state = {
    collection: '',
    items: [{
      id: 0,
      coverLink: '#',
      title: '#'
    }]
  }

  constructor(props: any) {
    super(props);
    this.state.items = [{
      id: 0,
      coverLink: '#',
      title: '#'
    }];
  }

  componentDidMount() {
    window.fetch('https://api.id-anime.net/v1/animes')
      .then((response: any) => {
        response.json().then((data: any) => {
          console.log(data);
          this.setState({
            collection: data,
            items: data.items,
          });
        });
      });
  }

  render() {
    const collections = this.state.items;

    return (
      <div className='body-container'>
        <Container>
          <Column.Group vcentered multiline gapSize={8} className='anime-grid'>
            {collections.map(collection => (
              <Column size='one-quarter' key={collection.id}>
                <Link to={'/animes/' + collection.id}>
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
          </Column.Group>
        </Container>
      </div>
    );
  }
}
