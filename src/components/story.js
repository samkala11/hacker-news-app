import React, {useEffect, useState} from 'react';

import {getStory} from '../utils/stories_api_util';
import CommentsContainer from './CommentsContainer';

const Story = ({storyId}) => {

    const [storyInfo, setStoryInfo] = useState({});
    const [showComments, setShowComments] = useState(false);

    useEffect(() => {

        getStory(storyId).then((data) => {
            console.log(JSON.stringify(data));
            setStoryInfo(data);
        })

    }, [ storyId ])


    const handleShowComments = () => {
        setShowComments(!showComments)
    }

    return(
        <div>
            {/* {JSON.stringify(storyInfo)  } */}

            <a href={storyInfo.url}> {storyInfo.title} </a>
            <div> By: {storyInfo.by} </div>
            <div onClick={handleShowComments}> Comments: {storyInfo.descendants} </div>

            {showComments && storyInfo.kids &&   <CommentsContainer commentIds={storyInfo.kids} level={0}/> }

        </div>
    )
}

export default Story;