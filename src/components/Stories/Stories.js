import React , {useEffect, useState} from 'react';
import Story from '../Story';
import CircularProgress from '@material-ui/core/CircularProgress';
import {getTopStories} from '../../utils/stories_api_util';
import classNames from 'classnames';

function Stories() {

  const STORIES_COUNT_INCREMENT = 20;
  const MAX_STORIES_COUNT = 400;

  const [storiesCount, setStoriesCount] = useState(STORIES_COUNT_INCREMENT);

  window.storiesCountState = storiesCount;

  const [currentStories, setCurrentStories] = useState([]);
  const [loading, setLoading] = useState(false);

  const oldStoriesCount = localStorage.getItem('oldStories');
  window.oldStoriesCount = oldStoriesCount;
  window.currentStories = currentStories;

  const [hideOldPosts, setHideOldPosts] = useState(false);
  const [currentStartingPoint, setCurrentStartingPoint] = useState( oldStoriesCount ? parseInt(oldStoriesCount) : 0 );
  window.currentStartingPoint = currentStartingPoint;

  useEffect(() => {
    getTopStories().then(data => {
      setCurrentStories(data);
      console.log(data)
    })

  }, [storiesCount])

  useEffect(() => {


    window.addEventListener('scroll', handleScroll);
      
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
      }, 1000)
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
    <div className="Stories">

      {
        oldStoriesCount && hideOldPosts ? currentStories.slice(currentStartingPoint, (storiesCount + parseInt(oldStoriesCount))).map((storyId, index) => (
        <div key={storyId} 
        className = {classNames('story-div', 'updated-count', { 'first-story': index === 0})}
        // className="story-div updated-count"
        >
          <Story 
            storyId={storyId}
            storyIndex = {index}
            />
        </div> 
      ))  : 
       currentStories.slice(0, storiesCount).map((storyId, index) => (
        <div key={storyId} 
          // className="story-div"
          className = {classNames('story-div', { 'first-story': index === 0})}
 
          >
          <Story 
            storyId={storyId}
            storyIndex = {index}
            />
        </div>  )) }

      {/* { loading } */}
      {  loading && <div className="loading"> <CircularProgress/> </div>}


    </div>
  );
}

export default Stories;
