import React, {useEffect, useState} from 'react';

import {getStory} from '../utils/stories_api_util';
import CommentsContainer from './CommentsContainer';
import { convertTime } from '../utils/time';
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


const Story = ({storyId, storyIndex, className, bookmarked, callBack}) => {

    const [storyInfo, setStoryInfo] = useState({});
    const [showComments, setShowComments] = useState(false);
    const bookmarkedPostIdsRef = firestore.collection('bookmarkedPostIds');

    const bookmarkPost = () => {
        const docId = Math.random().toString(36).substr(2, 12);
        bookmarkedPostIdsRef.doc(docId).set({
            hackerNewsUserId: localStorage.getItem('hackerNewsUserId'),
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            postId: storyId
        })
        .then(() => { 
            console.log('new bookmarked post was addedd successfully');
            callBack();
        })
        .catch((e) =>{

            console.log('cannot bookmark post')
            console.log(e)
        })
    }
    
    const getStoryNumber = () => {
        return storyIndex + 1
    }

    useEffect(() => {

        getStory(storyId).then((data) => {
            // console.log(JSON.stringify(data));
            setStoryInfo(data);
        })

    }, [ storyId ])


    const handleShowComments = () => {
        setShowComments(!showComments)
    }

    // const saveToLocalStorage = () => {
    //     const bookmarkedIds = localStorage.getItem('storyId');
    //     let bookmarkedArr = []
    //     if (bookmarkedIds) {
    //         bookmarkedArr = JSON.parse(bookmarkedIds);
    //         console.log('bookmarkedArr')
    //         console.log(bookmarkedArr)

    //         window.bookmarkedArr = bookmarkedArr;
    //     }
    //     localStorage.setItem('storyId', JSON.stringify([ ...bookmarkedArr, storyId]))
    // }

    // const bookmarkPost = () => {

    // }

    return(
        <div className={className}>
            {/* {JSON.stringify(storyInfo)  } */}

            <span> { getStoryNumber()}.</span>

            <a  className="story-title" href={storyInfo.url}> { `${storyInfo.title}` } </a>
            
           { bookmarked ?
            <button disabled> Bookmarked </button> 
            :
            <button onClick={bookmarkPost}> Bookmark </button> 
             }
            
            <div className="story-info">  
                <div className="points-info"> {storyInfo.score} points </div>
                <div  className="author-info"> by: {storyInfo.by} </div>
                <div className="time-info"> {convertTime(storyInfo.time)} ago</div>
                <div  className="story-comment" onClick={handleShowComments}> {storyInfo.descendants} comments </div>
            </div>

            {showComments && storyInfo.kids && <CommentsContainer commentIds={storyInfo.kids} level={0}/> }

        </div>
    )
}

export default Story;