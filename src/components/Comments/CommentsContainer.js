import React from 'react';
import Comment from './Comment';
import '../../styles/Comments/CommetsContainer.css';


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