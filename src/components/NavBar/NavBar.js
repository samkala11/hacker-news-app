import React, {useEffect, useState} from 'react';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';  
import { useHistory } from 'react-router-dom';

import Story from '../Story';
import { getUpdatedStories, getStory } from '../../utils/stories_api_util';


const NavBar = () => {

    const [value, setValue] = React.useState(0);
    const history = useHistory();

    const [showPost, setShowPost] = useState(false);
    const [ updatedPostNumbers, setUpdatedPostNumbers] = useState(0);
    const [updatedPostIds, setUpdatedPostIds] = useState([]);
    window.updatedPostIds = updatedPostIds;


    const [updatedPosts, setUpdatedPosts] = useState({});
    window.updatedPostState = updatedPosts;


    // const [postCommentsDict, setPostCommentsDict] = useState([]);
    // window.postCommentsDict = postCommentsDict;

    const handleChange = (event, newValue) => {
      setValue(newValue);

        if (newValue === 0 ) {
            console.log('going to home ');
            history.push('/')
            if (showPost) {
                setShowPost(false)
            }
        } else if (newValue === 1) {
            console.log('going to old stories page ');
            history.push('/old-stories');
            if (showPost) {
                setShowPost(false)
            }
        } else if (newValue === 2) {
            console.log('going to old stories page ');
            history.push('/');
            setShowPost(!showPost)
        }
    };

    const checkForUpdates = () => {
        const bookmarkedStoryIds = JSON.parse(localStorage.getItem('storyId'));
        console.log('bookmarked ids from local storage');
        console.log(bookmarkedStoryIds);
       
        let postCommentsInfoArr = [];

        if (bookmarkedStoryIds) {


            getUpdatedStories().then(data => {
                console.log('updated stories data')
                console.log(data);

                const updatedIds = [];
                // checkBookmarkedItemsUpdates();
                bookmarkedStoryIds.forEach( storyId => {
                    if (data.items.includes(storyId)) {
                        console.log(`the item ${storyId} is updated`);
                        setUpdatedPostNumbers(prevCount => prevCount + 1);
                        updatedIds.push(storyId);

                    } else {
                        console.log(`the item ${storyId} is not updated`)
                    }
                })
                setUpdatedPosts(data.items);
                setUpdatedPostIds([...updatedPostIds, ...updatedIds ]);

            })

            // bookmarkedStoryIds.forEach(storyId => {
            //     console.log(storyId);
    
            //     // setNumberOfCommentsForEachId(storyId);
            //     getStory(storyId).then(data => {
            //         console.log(`kids lengthh from setcomments for post id ${storyId}`)
            //         console.log(data.descendants);

            //         console.log('postCommentsDict[0]');
            //         console.log(postCommentsDict[0]);
            //         if (postCommentsDict[0] && postCommentsDict[0].descendants === data.descendants) {
            //             console.log('they have the same number of kids')
            //         } else {
            //             console.log('they DONT have the same number of kids')
            //         }
        
            //         postCommentsInfoArr.push({ storyId: storyId, descendants: data.descendants})    
            //     })
                
            // });
        }


        // setPostCommentsDict(postCommentsInfoArr)

    }

    // const setNumberOfCommentsForEachId = (id) => {
    //     getStory(id).then(data => {
    //         console.log(`kids lengthh from setcomments for post id ${id}`)
    //         console.log(data.descendants)

    //         let postInfo = { storyId: id, descendants: data.descendants};
    //         setPostCommentsDict([...postCommentsDict, postInfo])

    //     })
    // }

    useEffect(() => {

        const timer = setInterval(() => { checkForUpdates() },15000)
        

        let  currentHref = window.location.href
        if (currentHref.substr(currentHref.length - 1) === '/') {
            return;
        } else if (currentHref.substr(currentHref.length - 9) === '/listings') {
            setValue(1)
        }

        return () => { clearInterval(timer)}
    }, [])

    return (
        <div data-testid='nav-bar' className="nav-bar">
            <Paper id="nav-bar-container" square>
                <Tabs
                    value={value}
                    indicatorColor="primary"
                    textColor="primary"
                    onChange={handleChange}
                    aria-label="disabled tabs example"
                >
                    <Tab data-testid='home-tab' label="Home" />
                    <Tab data-testid='listings-tab' label="Seen Posts" />
                    <Tab data-testid='saved-listings-tab' label="Updates" />
                    <div className="notification-number"> {updatedPostNumbers} </div>
                    
                </Tabs>
            </Paper>

            { showPost && <Story className="story-notification" storyId={24992517} /> }

        </div>
    ) 
}

export default NavBar;