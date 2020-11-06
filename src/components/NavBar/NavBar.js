import React, {useEffect, useState} from 'react';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';  
import { useHistory } from 'react-router-dom';
import classNames from 'classnames';
import Post from '../Posts/Post';
import { getUpdatedStories, getStory } from '../../utils/stories_api_util';


const NavBar = ({firestore}) => {

    const [value, setValue] = React.useState(0);
    const history = useHistory();

    // show notification numbers
    const [updatedPostNumbers, setUpdatedPostNumbers] = useState(0);
    const [updatedAndBookmarked, setUpdatedAndBookmarked] = useState([]);

    const [showPost, setShowPost] = useState(false);
    const [ currentUserBookmarkedPosts, setCurrentUserBookmarkedPosts ] = useState([]);

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
        
        let  currentHref = window.location.href
        if (currentHref.substr(currentHref.length - 1) === '/') {
            return;
        } else if (currentHref.substr(currentHref.length - 10 ) === '/old-posts') {
            setValue(1)
        }

        return () => { 
            clearInterval(timer) ; 
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
            history.push('/old-posts');
            if (showPost) {
                setShowPost(false)
            }
        } else if (newValue === 2) {
            console.log('going to old stories page ');
            history.push('/');
            setShowPost(!showPost)
        }
    };


        const checkForUpdates = async () => {

            const bookmarkedPostIdsQuery2 = bookmarkedPostIdsRef.where("hackerNewsUserId", "==", localStorage.getItem('hackerNewsUserId')).orderBy('createdAt').limit(25) 
    
            const bookMarkedSnapshot = await bookmarkedPostIdsQuery2.get()

            const currentBookmarkedPostIds = [];
            bookMarkedSnapshot.docs.forEach( (doc, ind) => {
                currentBookmarkedPostIds.push(doc.data().postId);
            });
            
            const updatedPostsData = await getUpdatedStories()

            const updatedAndBookmarkedArr = []
            currentBookmarkedPostIds.forEach( (bookmarkedPostId) => {

                if (updatedPostsData.items.includes(bookmarkedPostId)) { 

                    console.log(`bookmarked post id is ${bookmarkedPostId} and it is updated`);
                    updatedAndBookmarkedArr.push(bookmarkedPostId);
                    setUpdatedPostNumbers(prevCount => prevCount + 1);

                } else {

                    console.log(`bookmarked post id is ${bookmarkedPostId} and it is not updated`);

                }
            })
            const updatedArr = updatedAndBookmarkedArr.concat(updatedAndBookmarked);
            console.log('updatedArr plus current ones in state')

            console.log(updatedAndBookmarked)
            setUpdatedAndBookmarked(updatedArr);  
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
                    <Tab data-testid='listings-tab' label="Previous Posts" />
                    <Tab data-testid='saved-listings-tab' label="Updated" />
                    <div className = {classNames('notification-number', { 'notification-number-2': updatedPostNumbers >= 100})}
                    > {updatedPostNumbers} </div>
                </Tabs>
            </Paper>

            { showPost && <div className="updated-posts-container">
            
             {updatedAndBookmarked.map((storyId, index) => ( <div key={index} 
                      className = {classNames('story-div story-div-updated', { 'first-story': false})}
                    >
                    <Post 
                        storyId={storyId}
                        storyIndex = {index}
                        />
                    </div> )) 
             }
            </div>
            
             }
        </div>
    ) 
}

export default NavBar;