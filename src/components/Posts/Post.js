import React, {useEffect, useState} from 'react';

import {getStory} from '../../utils/stories_api_util';
import CommentsContainer from '../Comments/CommentsContainer';
import { convertTime } from '../../utils/time';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder';
import BookmarkIcon from '@material-ui/icons/Bookmark';


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


const Story = ({storyId, storyIndex, className, bookmarked, callBack, showBookmark }) => {

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
            // window.location.reload();
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

    return(
        <div className={className}>

            <span> { getStoryNumber()}.</span>
            <a  className="story-title" href={storyInfo.url}> { `${storyInfo.title}` } </a>
            {showBookmark && <span>

                { bookmarked ?
                    <button className="bookmark-button" disabled> <BookmarkIcon/> </button> 
                    :
                    <button className="bookmark-button" onClick={bookmarkPost}> <BookmarkBorderIcon/> </button> 
                }
            </span>}
            
            <div className="story-info">  
                <div className="points-info"> {storyInfo.score} points </div>
                <div className="author-info"> by: {storyInfo.by} </div>
                <div className="time-info"> {convertTime(storyInfo.time)} ago</div>
                <div className="story-comment" onClick={handleShowComments}> {storyInfo.descendants} comments </div>
            </div>

            {showComments && storyInfo.kids && <CommentsContainer commentIds={storyInfo.kids} level={0}/> }

        </div>
    )
}

export default Story;