import React, {useEffect, useState} from 'react';
import {getTopStories} from '../../utils/stories_api_util';
import Story from '../Story';
import classNames from 'classnames';

const OldStories = ({firestore}) => {

  const bookmarkedPostIdsRef = firestore.collection('bookmarkedPostIds');
  const bookmarkedPostIdsQuery = bookmarkedPostIdsRef.where("hackerNewsUserId", "==", localStorage.getItem('hackerNewsUserId')).orderBy('createdAt').limit(25) 

  const [currentStories, setCurrentStories] = useState([]);
  const [ currentUserBookmarkedPosts, setCurrentUserBookmarkedPosts ] = useState([]);
  // window.currentUserBookmarkedPosts = currentUserBookmarkedPosts;
  const oldStoriesCount = localStorage.getItem('oldStories');

  useEffect(() => {

    getBookmarkedPosts();

      getTopStories().then(data => {
        setCurrentStories(data);
        console.log(data)
      })
  
    }, [] )

    const getBookmarkedPosts = () => {

      console.log('getting updated post ids from firestore inside OLD stories')
  
      bookmarkedPostIdsQuery.get().then( snapshot => {
        const currentBookmarkedPostIds = [];
        // console.log(snapshot.docs)
        snapshot.docs.forEach( (doc, ind) => {
          currentBookmarkedPostIds.push(doc.data().postId);
          console.log('got docs from snapshot from stories container, showing  bookmarked ones!!')
        })
  
        setCurrentUserBookmarkedPosts(currentBookmarkedPostIds);
      })
    };

    return(<>
          { !oldStoriesCount && <div className="no-old-posts-message"> No previous posts </div>  }

          { currentStories.slice(0, oldStoriesCount).map((storyId, index) => (
            <div key={storyId} 
                className = {classNames('story-div', { 'first-story': index === 0})}
             >
              <Story 
                storyId={storyId}
                storyIndex = {index}
                bookmarked={currentUserBookmarkedPosts.includes(storyId)}
                callBack = {getBookmarkedPosts}
                showBookmark = {true}
                className="post-container"
              />
            </div>  )) }
            </>)

    }

export default OldStories;