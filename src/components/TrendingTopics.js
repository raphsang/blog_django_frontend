import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './TrendingTopics.css';

const makeAbsoluteURL = (url) => {
    if (!url) return null; // Return null if there's no image

    const baseURL = 'https://raphsang.pythonanywhere.com/';
    // Check if the URL already starts with '/media/posts/'
    if (url.startsWith('/media/posts/')) {
        return `${baseURL}${url}`;
    }
    // Otherwise, append '/media/posts/' to the URL
    return `${baseURL}/media/posts/${url}`;
};

const TrendingTopics = () => {
    const [trendingPosts, setTrendingPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTrendingPosts = async () => {
            setLoading(true);
            try {
                const response = await axios.get('https://raphsang.pythonanywhere.com//api/trending-posts/');
                const postsWithAbsoluteURLs = response.data.map(post => ({
                    ...post,
                    imageURL: makeAbsoluteURL(post.image),
                }));
                setTrendingPosts(postsWithAbsoluteURLs);
            } catch (error) {
                console.error('Error fetching trending posts:', error);
                setError('Failed to fetch trending posts.');
            } finally {
                setLoading(false);
            }
        };

        fetchTrendingPosts();
    }, []);

    return (
        <div className="trending-topics">
            <h3>Trending Topics</h3>
            {loading && <p>Loading trending posts...</p>}
            {error && <p className="error-message">{error}</p>}
            <ul className="trend">
                {trendingPosts.length > 0 ? (
                    trendingPosts.map((post) => (
                        <li className="postz" key={post.id}>
                            <div className="post-content">
                                {post.imageURL ? (
                                    <img
                                        src={post.imageURL}
                                        alt={post.title}
                                        className="postz-image"
                                    />
                                ) : (
                                    <p>No image available</p>
                                )}
                                <div className="text-content">
                                    <h4>{post.title}</h4>
                                    <p className="postz-description">{post.description}</p>
                                    <Link to={`/posts/${post.slug}`} className="view-details-link">View Details</Link>
                                </div>
                            </div>
                        </li>
                    ))
                ) : (
                    <p>No trending topics available</p>
                )}
            </ul>
        </div>
    );
};

export default TrendingTopics;
