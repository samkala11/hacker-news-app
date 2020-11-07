import React , {useEffect, useState} from 'react';
import Post from './Post';
import {getTopStories} from '../../utils/stories_api_util';
import classNames from 'classnames';
import Skeleton from '@material-ui/lab/Skeleton';
import '../../styles/Posts/PostsDisplay.css';


function PostsDisplay({firestore, type}) {

    const bookmarkedPostIdsRef = firestore.collection('bookmarkedPostIds');
    const bookmarkedPostIdsQuery = bookmarkedPostIdsRef.where("hackerNewsUserId", "==", localStorage.getItem('hackerNewsUserId')).orderBy('createdAt').limit(25) 

    const STORIES_COUNT_INCREMENT = 20;
    const MAX_STORIES_COUNT = 400;
    
    const [currentStories, setCurrentStories] = useState([]);
    const [ currentUserBookmarkedPosts, setCurrentUserBookmarkedPosts ] = useState([]);

    const [storiesCount, setStoriesCount] = useState(STORIES_COUNT_INCREMENT);

    const [loading, setLoading] = useState(false);

    const oldStoriesCount = localStorage.getItem('oldStories');

    const [hideOldPosts, setHideOldPosts] = useState(false);
    const [currentStartingPoint, setCurrentStartingPoint] = useState( oldStoriesCount ? parseInt(oldStoriesCount) : 0 );
  



  window.currentUserBookmarkedPosts = currentUserBookmarkedPosts;

  const getBookmarkedPosts = () => {

    console.log('getting updated post ids from firestore inside stories')

    bookmarkedPostIdsQuery.get().then( snapshot => {
        const currentBookmarkedPostIds = [];
        // console.log(snapshot.docs)
        snapshot.docs.forEach( (doc, ind) => {
          currentBookmarkedPostIds.push(doc.data().postId);
        })

        setCurrentUserBookmarkedPosts(currentBookmarkedPostIds);
    })
}


  useEffect(() => {
    getTopStories().then(data => {
      setCurrentStories(data);
      console.log(data)
    })

  }, [storiesCount])

  useEffect(() => {
    getBookmarkedPosts();

    if (type !== 'oldPosts') {

        window.addEventListener('scroll', handleScroll);
    }
      
    if (oldStoriesCount) {
        console.log('setting hide old posts to true')
        setHideOldPosts(true);
    }

    // unsubscribe
    return ()=> {window.removeEventListener('scroll', handleScroll) };

  }, []);


  // update count when reaching bottom of the page
  useEffect(() => {
    if (!loading) return;

    if (storiesCount + STORIES_COUNT_INCREMENT >= MAX_STORIES_COUNT) { 
      setStoriesCount(MAX_STORIES_COUNT)
    //   localStorage.setItem()
      localStorage.setItem('oldStories', MAX_STORIES_COUNT - STORIES_COUNT_INCREMENT);

    } else {
      setTimeout( () => {
        setStoriesCount(prevCount => prevCount + STORIES_COUNT_INCREMENT );
        // localStorage.setItem('oldStories', storiesCount) ;

        if (oldStoriesCount) {
            localStorage.setItem('oldStories', ( parseInt(oldStoriesCount) + STORIES_COUNT_INCREMENT) );
            localStorage.setItem('lastSeenPostId', currentStories[0])
        } else {
            localStorage.setItem('oldStories', storiesCount)
            localStorage.setItem('lastSeenPostId', currentStories[0]) ;
        }
        setLoading(false)
      }, 500)
    }

  }, [loading])



  const handleScroll = (e) => {

    console.log(e.currentTarget.scrollHeight)

    const { scrollTop, offsetHeight } = document.documentElement;

    console.log(`scrollTop doc element  ${scrollTop}`)
    console.log(`innert Height window  ${window.innerHeight}`)
    console.log(`offsetheight  ${offsetHeight}`)

    // if at bottom of page
    if ( (window.innerHeight + scrollTop) !== offsetHeight || loading ) { 
      return false;
    }

    setLoading(true)

  }
  
  return (
    <>
        {  type !== 'oldPosts'  
            ?
        <div className="all-posts"> 

            { oldStoriesCount && hideOldPosts ? currentStories.slice(currentStartingPoint, (storiesCount + parseInt(oldStoriesCount))).map((storyId, index) => (
                <div key={index}>
                    <Post 
                        storyId={storyId}
                        storyIndex = {index}
                        bookmarked={currentUserBookmarkedPosts.includes(storyId)}
                        callBack = {getBookmarkedPosts}
                        showBookmark = {true}
                        className = {classNames('post-container', 'post-div', 'updated-count', { 'first-post': index === 0})}
                    />
                </div> ))  
                : 
            currentStories.slice(0, storiesCount).map((storyId, index) => (
                <div key={index}>
                    <Post 
                        storyId={storyId}
                        storyIndex = {index}
                        bookmarked={currentUserBookmarkedPosts.includes(storyId)}
                        callBack = {getBookmarkedPosts}
                        showBookmark = {true}
                        className={classNames( 'post-container', 'post-div', { 'first-post': index === 0})}
                    />
                </div> )) }

            { loading && <div className="loading">
                <Skeleton variant="text" />
                <Skeleton variant="text" />
            </div> }
        
        </div>  
        
            : 

        <div className="old-posts"> 

          { !oldStoriesCount && <div className="no-old-posts-message"> No previous posts </div>  }

          { currentStories.slice(0, oldStoriesCount).map((storyId, index) => (    
            <div key={index}>
                <Post 
                storyId={storyId}
                storyIndex = {index}
                bookmarked={currentUserBookmarkedPosts.includes(storyId)}
                callBack = {getBookmarkedPosts}
                showBookmark = {true}
                className={classNames( 'post-container', 'post-div', { 'first-post': index === 0})}
                />
            </div> 
              )) } 
            
        </div> }
    </>
  );
}

export default PostsDisplay;
