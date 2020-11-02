import React , {useEffect, useState} from 'react';
import Story from './components/story';

import './App.css';

import {getTopStories} from './utils/stories_api_util';

function App() {

  const STORIES_COUNT_INCREMENT = 30;
  const MAX_STORIES_COUNT = 400;

  const [storiesCount, setStoriesCount] = useState(STORIES_COUNT_INCREMENT);

  window.storiesCountState = storiesCount;

  const [currentStories, setCurrentStories] = useState([]);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    getTopStories().then(data => {
      setCurrentStories(data);
      console.log(data)
    })

  }, [storiesCount])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return ()=> {window.removeEventListener('scroll', handleScroll) }

  })



  const handleScroll = (e) => {

    console.log(e.currentTarget.scrollHeight)

    const { scrollTop, offsetHeight } = document.documentElement;

    console.log(`scrollTop doc element  ${scrollTop}`)
    console.log(`innert Height window  ${window.innerHeight}`)
    console.log(`offsetheight  ${offsetHeight}`)


    // if at bottom of page
    if ( (scrollTop + window.innerHeight - offsetHeight) >= -1 &&  (scrollTop + window.innerHeight - offsetHeight) <= 1  ) {

      console.log('at the end of the pagee ************AAAKFJF !!!  ')

      if (storiesCount + STORIES_COUNT_INCREMENT >= MAX_STORIES_COUNT) {
        
        if (storiesCount !== MAX_STORIES_COUNT) {

          setStoriesCount(MAX_STORIES_COUNT)
        }
      } else {
        setLoading(true)
        setTimeout( () => {

          setStoriesCount(prevCount => prevCount + STORIES_COUNT_INCREMENT )
        }, 1000)
      }
    }
  }

  

  
  return (
    <div className="App">
      <h2>Hello </h2>

      {currentStories.slice(0, storiesCount).map(storyId => (
        <div key={storyId} className="story-div">

          { `${storyId}` } 
            <Story storyId={storyId}/>
        </div> 
      )
      )}

      {loading && <h3> Loading..... </h3>}
    </div>
  );
}

export default App;
