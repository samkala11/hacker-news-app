import React, {useEffect, useState} from 'react';
import {getTopStories} from '../../utils/stories_api_util';
import Story from '../Story';
import classNames from 'classnames';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

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


const OldStories = () => {

    const [currentStories, setCurrentStories] = useState([]);
    
    const oldStoriesCount = localStorage.getItem('oldStories');

    const bookmarkedPostIdsRef = firestore.collection('bookmarkedPostIds');
    const bookmarkedPostIdsQuery = bookmarkedPostIdsRef.where("hackerNewsUserId", "==", localStorage.getItem('hackerNewsUserId')).orderBy('createdAt').limit(25) 
  

    const [ currentUserBookmarkedPosts, setCurrentUserBookmarkedPosts ] = useState([]);
    window.currentUserBookmarkedPosts = currentUserBookmarkedPosts;

    const getBookmarkedPosts = () => {

      console.log('getting updated post ids from firestore inside OLD stories')
  
      bookmarkedPostIdsQuery.get().then( snapshot => {
          const currentBookmarkedPostIds = [];
          // const docIds = {};
          console.log(snapshot.docs)
          snapshot.docs.forEach( (doc, ind) => {
  
              currentBookmarkedPostIds.push(doc.data().postId);
  
              console.log('got docs from snapshot from stories container, showing  bookmarked ones!!')
              console.log(doc.data())
  
          })
  
          console.log('currentBookmarkedPostIds');
          console.log(currentBookmarkedPostIds)
          setCurrentUserBookmarkedPosts(currentBookmarkedPostIds);
      })
  }


    useEffect(() => {

      getBookmarkedPosts();
      
        getTopStories().then(data => {
          setCurrentStories(data);
          console.log(data)
        })
    
      }, [])

    return(<div>
            {/* <h2> Old Stories </h2> */}

            {   currentStories.slice(0, oldStoriesCount).map((storyId, index) => (
                <div key={storyId} 
                    className = {classNames('story-div', { 'first-story': index === 0})}
                    >
                    <Story 
                        storyId={storyId}
                        storyIndex = {index}
                        bookmarked={currentUserBookmarkedPosts.includes(storyId)}
                        callBack = {getBookmarkedPosts}
                        />
                    </div>  )) }
                </div>)

    }

export default OldStories;