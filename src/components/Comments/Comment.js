import React, {useEffect, useState} from 'react';
import arrow from '../../arrow.png';

import {getStory} from '../../utils/stories_api_util';
import CommentsContainer from './CommentsContainer';
import { convertTime } from '../../utils/time';
import '../../styles/Comments/Comment.css';


const Comment = ({commentId, level}) => {

    const [commentInfo, setCommentInfo] = useState({});
    const [showComments, setShowComments] = useState(true);

    useEffect(() => {

        getStory(commentId).then((data) => {
            console.log(JSON.stringify(data));
            setCommentInfo(data);
        })

    }, [ commentId ])

    const getCommentStyle = () => {

        return {
            'margin-left': `${level * 10}px`
        }
    }


    const handleShowComments = () => {
        setShowComments(!showComments)
    }


    return(
        <div style ={getCommentStyle()} >



            <div className="comment-by"> 
                <img  className="arrow-icon" src={arrow}/>
                {commentInfo.by} {convertTime(commentInfo.time)} ago
            </div>

            <div className="comment-text">
                {commentInfo.text}
            </div>

            <div className="comment-info">        
                {  commentInfo.kids && <div className="comments-number" onClick={handleShowComments}>  {  commentInfo.kids ? commentInfo.kids.length : null } comments</div>
                }
                
            </div>

            <div>  
                {showComments && commentInfo.kids && <CommentsContainer 

                    commentIds={commentInfo.kids}
                    level= { level + 1 } 

                 />}
            </div>
        </div>
    )
}

export default Comment;