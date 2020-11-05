import React, {useEffect, useState} from 'react';
import {getTopStories} from '../../utils/stories_api_util';
import Story from '../Story';
import classNames from 'classnames';



const OldStories = () => {

    const [currentStories, setCurrentStories] = useState([]);
    
    const oldStoriesCount = localStorage.getItem('oldStories');



    useEffect(() => {

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
                        />
                    </div>  )) }
                </div>)

    }

export default OldStories;