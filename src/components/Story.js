import React, {useEffect, useState} from 'react';

import {getStory} from '../utils/stories_api_util';
import CommentsContainer from './CommentsContainer';
import { convertTime } from '../utils/time';

const Story = ({storyId, storyIndex, className}) => {

    const [storyInfo, setStoryInfo] = useState({});
    const [showComments, setShowComments] = useState(false);

    // console.log(storyIndex)

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

    const saveToLocalStorage = () => {
        const bookmarkedIds = localStorage.getItem('storyId');
        let bookmarkedArr = []
        if (bookmarkedIds) {
            bookmarkedArr = JSON.parse(bookmarkedIds);
            console.log('bookmarkedArr')
            console.log(bookmarkedArr)

            window.bookmarkedArr = bookmarkedArr;
        }
        localStorage.setItem('storyId', JSON.stringify([ ...bookmarkedArr, storyId]))
    }

    return(
        <div className={className}>
            {/* {JSON.stringify(storyInfo)  } */}

            <span> { getStoryNumber()}.</span>

            <a  className="story-title" href={storyInfo.url}> { `${storyInfo.title}` } </a>
            
            <button onClick={saveToLocalStorage}> Bookmark </button>
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