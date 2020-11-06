import React , {useEffect, useState} from 'react';
import { Route, Switch , BrowserRouter} from 'react-router-dom';
import NavBar from './components/NavBar/NavBar';
import Posts from './components/Posts/Posts';
import OldPosts from './components/OldPosts/OldPosts';
import ErrorPage from './components/ErrorPage/ErrorPage';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import Story from './components/Posts/Post';

import './App.css';

if (!firebase.apps.length) {

  firebase.initializeApp({
    apiKey: "AIzaSyAX1uTdQTvuj2NJIfPnxzr76smlBL6IlLU",
    authDomain: "project-sam5.firebaseapp.com",
    databaseURL: "https://project-sam5.firebaseio.com",
    projectId: "project-sam5",
    storageBucket: "project-sam5.appspot.com",
    messagingSenderId: "485971260822",
    appId: "1:485971260822:web:7c53421f33a09778a619b7",
    measurementId: "G-L47W9F94F1"
  });
}

const firestore = firebase.firestore();


function App() {


  useEffect(() => {
    if (!localStorage.getItem('hackerNewsUserId')) {
      localStorage.setItem('hackerNewsUserId', Math.random().toString(36).substr(2, 10));
    }
  }, [])

  return (
    <div className="App">
      <BrowserRouter>
        <NavBar firestore={firestore}/>
        <Switch>
        
          <Route exact path="/" component={() => <Posts firestore={firestore} /> }             
          />

          <Route exact path="/old-posts" component={() => <OldPosts firestore={firestore} /> }
          />

          <Route component={ErrorPage} />


        </Switch>

      </BrowserRouter>

    </div>
  );
}

export default App;
