import $ from 'jquery';


export const getTopStories = () => (
    $.ajax({
        method: 'GET',
        url: 'https://hacker-news.firebaseio.com/v0/topstories.json',
        error: (err) => console.log(err)
    })
);
      


export const getStory = (storyId) => (
    $.ajax({
        method: 'GET',
        url: `https://hacker-news.firebaseio.com/v0/item/${storyId}.json`,
        error: (err) => console.log(err)
    })
);
      
