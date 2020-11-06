import React, {useEffect, useState} from 'react';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';  
import { useHistory } from 'react-router-dom';
import classNames from 'classnames';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import Story from '../Story';
import { getUpdatedStories, getStory } from '../../utils/stories_api_util';


if (!firebase.apps.length) {

    firebase.initializeApp({
      apiKey: "AIzaSyAX1uTdQTvuj2NJIfPnxzr76smlBL6IlLU",
      authDomain: "project-sam5.firebaseapp.com",
      databaseURL: "https://project-sam5.firebaseio.com",
      projectId: "project-sam5",
      storageBucket: "project-sam5.appspot.com",
      messagingSenderId: "485971260822",
      appId: "1:485971260822:web:7c53421f33a09778a619b7",
      measurementId: "G-L47W9F94F1"
    });
  }

const firestore = firebase.firestore();


const NavBar = () => {

    const [value, setValue] = React.useState(0);
    const history = useHistory();

    // show notification numbers
    const [updatedPostNumbers, setUpdatedPostNumbers] = useState(0);
    const [updatedAndBookmarked, setUpdatedAndBookmarked] = useState([]);
    window.updatedAndBookmarkedNAVBAR = updatedAndBookmarked;

    const [showPost, setShowPost] = useState(false);
    const [ currentUserBookmarkedPosts, setCurrentUserBookmarkedPosts ] = useState([]);
    window.currentUserBookmarkedPostsNAVBAR = currentUserBookmarkedPosts;

    const bookmarkedPostIdsRef = firestore.collection('bookmarkedPostIds');
    const bookmarkedPostIdsQuery = bookmarkedPostIdsRef.where("hackerNewsUserId", "==", localStorage.getItem('hackerNewsUserId')).orderBy('createdAt').limit(25) 

    const getBookmarkedPosts = () => {

        console.log('getting bookmarked post ids from firestore')

        bookmarkedPostIdsQuery.get().then( snapshot => {
            const currentBookmarkedPostIds = [];
            console.log(`snapshot docs of bookmarked posts is ${snapshot.docs}`)

            console.log(snapshot.docs)
            snapshot.docs.forEach( (doc, ind) => {
                currentBookmarkedPostIds.push(doc.data().postId);
            })

            console.log('setting state for current bookmarked posts in nav bar');
            console.log(currentBookmarkedPostIds);
            setCurrentUserBookmarkedPosts(currentBookmarkedPostIds);

        })
    }

    useEffect(() => {
        getBookmarkedPosts();

        // check for updates each 15 seconds
        const timer = setInterval(() => { 
            // getBookmarkedPosts();
            checkForUpdates();
         },15000)

        
        // const timer2 = setInterval(() => {
        //     getBookmarkedPosts();
        // }, 5000)
        
        let  currentHref = window.location.href
        if (currentHref.substr(currentHref.length - 1) === '/') {
            return;
        } else if (currentHref.substr(currentHref.length - 9) === '/listings') {
            setValue(1)
        }

        return () => { 
            clearInterval(timer) ; 
            // clearInterval(timer2) ; 
        }
    }, [])


    const handleClick = (event, newValue) => {
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

            bookmarkedPostIdsQuery.get().then( snapshot => {
                const currentBookmarkedPostIds = [];
                console.log(`snapshot docs of bookmarked posts is ${snapshot.docs}`)
    
                console.log(snapshot.docs)
                snapshot.docs.forEach( (doc, ind) => {
                    currentBookmarkedPostIds.push(doc.data().postId);
                });

                getUpdatedStories().then(data => {
                    console.log('data of updated stories from hackernews api');
                    console.log(data.items);

                    console.log('closure on bookmarked snapshot from previous firestore bookmarked api call');
                    console.log(currentBookmarkedPostIds)

                    const updatedAndBookmarkedArr = []

                    currentBookmarkedPostIds.forEach( (bookmarkedPostId) => {

                        if (data.items.includes(bookmarkedPostId)) { 
                            console.log(`bookmarked post id is ${bookmarkedPostId} and it is updated`)
                            updatedAndBookmarkedArr.push(bookmarkedPostId);
                            setUpdatedPostNumbers(prevCount => prevCount + 1);
                        } else {
                            console.log(`bookmarked post id is ${bookmarkedPostId} and it is NOT updated`)
                        }

                    })

                    localStorage.setItem('updatedAndBookmarked', JSON.stringify(updatedAndBookmarkedArr));

                    

                    const concated = updatedAndBookmarkedArr.concat(updatedAndBookmarked);
                    console.log('concateddd previous updatedAndBookmarked in state')

                    console.log(updatedAndBookmarked)
                    setUpdatedAndBookmarked(concated);
                })
    
            })

            // const updatedAndBookmarkedArr = updatedAndBookmarked;
        //     const updatedAndBookmarkedArr = [];

        //     console.log('current user bookmarked posts in state is:')
        //     console.log(currentUserBookmarkedPosts);

        //     currentUserBookmarkedPosts.forEach( bookmarkedPostId => {
        //         // if bookmarked post is updated
        //         console.log('updated data.items from hacker news api');
        //         console.log(data.items);

        //         if (data.items.includes(bookmarkedPostId)) { 
        //             console.log(`bookmarked post id is ${bookmarkedPostId} and it is updated`)
        //             updatedAndBookmarkedArr.push(bookmarkedPostId);
        //             setUpdatedPostNumbers(prevCount => prevCount + 1);
        //         } else {
        //             console.log(`bookmarked post id is ${bookmarkedPostId} and it is NOT updated`)

        //         }
        //     })
        //     setUpdatedAndBookmarked(updatedAndBookmarkedArr);

        // })
    }




    return (
        <div data-testid='nav-bar' className="nav-bar">
            <Paper id="nav-bar-container" square>
                <Tabs
                    value={value}
                    indicatorColor="primary"
                    textColor="primary"
                    onChange={handleClick}
                    aria-label="disabled tabs example"
                >
                    <Tab data-testid='home-tab' label="Home" />
                    <Tab data-testid='listings-tab' label="Seen Posts" />
                    <Tab data-testid='saved-listings-tab' label="Updates" />
                    <div className="notification-number"> {updatedPostNumbers} </div>
                    

                    {/* <button onClick={addNewUpdatedPosts}> add new updated post</button> */}
                </Tabs>
            </Paper>

            { showPost && <div className="updated-posts-containers">
            
             {updatedAndBookmarked.map((storyId, index) => ( <div key={index} 
                      className = {classNames('story-div', { 'first-story': false})}
                    >
                    <Story 
                        storyId={storyId}
                        storyIndex = {index}
                        />
                    </div> )) 
             }
            </div>
            
             }
            {/* <Story className="story-notification" storyId={24992517} /> */}

        </div>
    ) 
}

export default NavBar;