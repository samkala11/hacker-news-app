import React from 'react';
// import {getStory} from '../utils/stories_api_util';
// import Story from './story';
import Comment from './Comment';


const CommentsContainer = ({commentIds, level}) => {

    return (
        commentIds.map(commentId => (
            <div key={commentId} className="story-div">
                <Comment commentId={commentId} level={level}/>
            </div> 
        ))
    )

}

export default CommentsContainer;