import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';

import { Navbar } from 'rbx';
import 'rbx/index.css';

import { AnimeCollection } from './AnimeCollection';
import AnimeStreaming from './AnimeStreaming';
import EpisodeStreaming from './EpisodeStreaming';

function App() {
  return (
    <div>
      <Navbar>
        <Navbar.Brand>
          <Navbar.Item href='/'>
            id-anime
          </Navbar.Item>
        </Navbar.Brand>
      </Navbar>
      <Router>
        <Switch>
          <Route exact path='/' component={AnimeCollection} />
          <Route exact path='/animes/:animeId' component={AnimeStreaming} />
          <Route exact path='/animes/:animeId/episodes/:episodeId' component={EpisodeStreaming} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
