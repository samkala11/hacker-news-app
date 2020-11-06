import React from 'react';
// import {getStory} from '../utils/stories_api_util';
// import Story from './story';
import Comment from './Comment';


const CommentsContainer = ({commentIds, level}) => {

    return (
        <div className="comment-container">
            {commentIds.map(commentId => (
                <Comment  key={commentId} commentId={commentId} level={level}/>
            ))}
        </div> 
    )

}

export default CommentsContainer;