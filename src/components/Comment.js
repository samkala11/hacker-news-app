import React, {useEffect, useState} from 'react';

import {getStory} from '../utils/stories_api_util';
import CommentsContainer from './CommentsContainer';

const Comment = ({commentId, level}) => {

    const [commentInfo, setCommentInfo] = useState({});
    const [showComments, setShowComments] = useState(false);

    useEffect(() => {

        getStory(commentId).then((data) => {
            console.log(JSON.stringify(data));
            setCommentInfo(data);
        })

    }, [ commentId ])

    const getCommentStyle = () => {

        return {
            'margin-left': `${level * 30}px`
        }
    }


    const handleShowComments = () => {
        setShowComments(!showComments)
    }


    return(
        <div style ={getCommentStyle()} >

            <div className="comment-text"> {commentInfo.text} </div>
            <div> By: {commentInfo.by} </div>
            <div> Comment Id: {commentId} </div>
            <div onClick={handleShowComments}> Comments to this comment: {  commentInfo.kids ? commentInfo.kids.length : null }</div>

            <div className="comments-container">  
                {showComments && commentInfo.kids && <CommentsContainer 

                    commentIds={commentInfo.kids}
                    level= { level + 1 } 

                 />}
            </div>
        </div>
    )
}

export default Comment;