// Search.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PostList from './PostList';
import SlidingPosts from './SlidingPosts'; // Import the SlidingPosts component
import SocialMediaLinks from './SocialMediaLinks'; // Import the SocialMediaLinks component
import './Search.css'; // Import the CSS file
import Signup from './Signup';

const Search = () => {
    const [posts, setPosts] = useState([]);
    const [featuredPosts, setFeaturedPosts] = useState([]); // State for carousel posts
    const [selectedCategory, setSelectedCategory] = useState('');

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get('https://raphsang.pythonanywhere.com/api/posts/', {
                    params: {
                        category: selectedCategory
                    }
                });
                console.log('Posts fetched:', response.data);
                setPosts(response.data);

                // Set featured posts (e.g., the first 5 posts)
                setFeaturedPosts(response.data.slice(0, 5)); // Adjust the slice as needed
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };

        // Fetch posts when selectedCategory changes
        fetchPosts();
    }, [selectedCategory]);

    return (
        <div className="search-container">
            {/* Display the social media links */}
           
            <PostList posts={posts} />
            {/* Sliding Post */}
           {/* {featuredPosts.length > 0 && <SlidingPosts posts={featuredPosts} />} */}
        </div>
    );
};

export default Search;
