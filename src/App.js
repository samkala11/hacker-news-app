import React , {useEffect, useState} from 'react';
import { Route, Switch , BrowserRouter} from 'react-router-dom';
import NavBar from './components/NavBar/NavBar';
import Stories from './components/Stories/Stories';
import OldStories from './components/OldStories/OldStories';
import ErrorPage from './components/ErrorPage/ErrorPage';
import Story from './components/Story';

import './App.css';


function App() {

  return (
    <div className="App">
      <BrowserRouter>
        <NavBar/>
        <Switch>
        
          <Route exact path="/" component={Stories} />
          <Route exact path="/old-stories" component={OldStories} />
          <Route exact path="/story-notification" 
            component={() => <Story storyId={24992517} />}
          />
          <Route component={ErrorPage} />


        </Switch>

      </BrowserRouter>

    </div>
  );
}

export default App;
