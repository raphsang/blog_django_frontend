import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';
import TrendingTopics from './TrendingTopics';
import './PostList.css';
import Profile from './Profile';
import SocialMediaLinks from './SocialMediaLinks';

const makeAbsoluteURL = (url) => {
    if (!url) return url;
    const baseURL = 'https://raphsang.pythonanywhere.com/media/';
    return url.startsWith('http') ? url : baseURL + url;
};

const PostList = () => {
    const [allPosts, setAllPosts] = useState([]); // Store all fetched posts
    const [displayedPosts, setDisplayedPosts] = useState([]); // Store posts to display
    const [categoryName, setCategoryName] = useState('');
    const [error, setError] = useState(null);
    const [readMoreStates, setReadMoreStates] = useState({});
    const [newComment, setNewComment] = useState({});
    const [postComments, setPostComments] = useState({});
    const [expandedComments, setExpandedComments] = useState({});
    const [commentReplies, setCommentReplies] = useState({});
    const [newReply, setNewReply] = useState({});
    const [replyFormVisible, setReplyFormVisible] = useState({});
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMorePosts, setHasMorePosts] = useState(true);
    const postsPerPage = 7; // Number of posts to display initially and load each time
    
    const location = useLocation();
    const navigate = useNavigate();
    const query = new URLSearchParams(location.search);
    const categoryId = query.get('category');
    const searchQuery = query.get('search');

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                console.log('Fetching posts with category:', categoryId, 'and search:', searchQuery);

                const response = await axios.get('https://raphsang.pythonanywhere.com/api/posts/', {
                    params: {
                        category: categoryId || undefined,
                        search: searchQuery || undefined
                    }
                });

                console.log('Posts fetched:', response.data);
                setAllPosts(response.data);
                
                // Display only the first set of posts
                setDisplayedPosts(response.data.slice(0, postsPerPage));
                
                // Check if there are more posts to load
                setHasMorePosts(response.data.length > postsPerPage);

                const commentsPromises = response.data.map(post =>
                    axios.get(`https://raphsang.pythonanywhere.com/api/comments/`, {
                        params: { post: post.id }
                    })
                );
                const commentsResponses = await Promise.all(commentsPromises);
                const commentsData = commentsResponses.reduce((acc, res, index) => {
                    acc[response.data[index].id] = res.data;
                    return acc;
                }, {});

                setPostComments(commentsData);

                // Fetch replies after comments are set
                const repliesPromises = Object.values(commentsData).flat().map(comment =>
                    axios.get(`https://raphsang.pythonanywhere.com/api/replies/`, {
                        params: { comment: comment.id }
                    })
                );
                const repliesResponses = await Promise.all(repliesPromises);
                const repliesData = repliesResponses.reduce((acc, res, index) => {
                    const commentId = Object.values(commentsData).flat()[index].id;
                    acc[commentId] = res.data;
                    return acc;
                }, {});
                setCommentReplies(repliesData);

            } catch (err) {
                console.error('Error fetching posts:', err);
                setError('An error occurred while fetching posts');
            }
        };

        fetchPosts();
    }, [categoryId, searchQuery]);

    useEffect(() => {
        const fetchCategoryName = async () => {
            if (!categoryId) return;
            try {
                const response = await axios.get(`https://raphsang.pythonanywhere.com/api/categories/${categoryId}/`);
                setCategoryName(response.data.name);
            } catch (err) {
                console.error('Error fetching category:', err);
                setError('An error occurred while fetching the category');
            }
        };

        fetchCategoryName();
    }, [categoryId]);

    const loadMorePosts = () => {
        setLoadingMore(true);
        
        // Calculate the next batch of posts to display
        const currentLength = displayedPosts.length;
        const nextPosts = allPosts.slice(currentLength, currentLength + postsPerPage);
        
        // Update displayed posts
        setDisplayedPosts([...displayedPosts, ...nextPosts]);
        
        // Check if there are more posts to load
        setHasMorePosts(currentLength + nextPosts.length < allPosts.length);
        setLoadingMore(false);
    };

    const toggleReadMore = (postId, event) => {
        event.preventDefault(); // Prevent the default link behavior
        setReadMoreStates((prevState) => ({
            ...prevState,
            [postId]: !prevState[postId]
        }));
    };

    const toggleComments = (postId, event) => {
        event.preventDefault(); // Prevent the default link behavior
        setExpandedComments((prevState) => ({
            ...prevState,
            [postId]: !prevState[postId]
        }));
    };

    const handleCommentChange = (postId, event) => {
        setNewComment({
            ...newComment,
            [postId]: event.target.value
        });
    };

    const handleCommentSubmit = async (postId) => {
        try {
            await axios.post(
                `https://raphsang.pythonanywhere.com/api/comments/`,
                {
                    post: postId,
                    content: newComment[postId]
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            setNewComment({
                ...newComment,
                [postId]: ''
            });

            const response = await axios.get(`https://raphsang.pythonanywhere.com/api/comments/`, {
                params: { post: postId }
            });
            setPostComments(prevState => ({
                ...prevState,
                [postId]: response.data
            }));
        } catch (err) {
            if (err.response && err.response.status === 401) {
                navigate('/login');
            } else {
                console.error('Error submitting comment:', err);
                setError('An error occurred while submitting the comment');
            }
        }
    };

    const handleReplyChange = (commentId, event) => {
        setNewReply({
            ...newReply,
            [commentId]: event.target.value
        });
    };

    const handleReplySubmit = async (commentId) => {
        try {
            const postId = Object.keys(postComments).find(id => postComments[id].some(comment => comment.id === commentId));
            if (!postId) return;

            await axios.post(
                `https://raphsang.pythonanywhere.com/api/replies/`,
                {
                    comment: commentId,
                    content: newReply[commentId]
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            setNewReply({
                ...newReply,
                [commentId]: ''
            });

            const response = await axios.get(`https://raphsang.pythonanywhere.com/api/comments/`, {
                params: { post: postId }
            });
            setPostComments(prevState => ({
                ...prevState,
                [postId]: response.data
            }));

            // Fetch updated replies
            const repliesResponse = await axios.get(`https://raphsang.pythonanywhere.com/api/replies/`, {
                params: { comment: commentId }
            });
            setCommentReplies(prevState => ({
                ...prevState,
                [commentId]: repliesResponse.data
            }));
        } catch (err) {
            if (err.response && err.response.status === 401) {
                navigate('/login');
            } else {
                console.error('Error submitting reply:', err);
                setError('An error occurred while submitting the reply');
            }
        }
    };

    const handleKeyDown = (event, postId) => {
        if (event.key === 'Enter' && !event.shiftKey) { // Check if Enter is pressed without Shift
            event.preventDefault(); // Prevent the default action (like adding a new line)
            handleCommentSubmit(postId);
        }
    };

    const toggleReplyForm = (commentId) => {
        setReplyFormVisible(prevState => ({
            ...prevState,
            [commentId]: !prevState[commentId]
        }));
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        navigate('/login');
    };

    return (
        <div className="page-container">
            <div className="left-side">
                {error && <p className="error-message">{error}</p>}
                {categoryName && <h2>{categoryName}</h2>}
                {displayedPosts.length > 0 ? (
                    <>
                        <ul className="post-list">
                            {displayedPosts.map(post => {
                                const imageURL = makeAbsoluteURL(post.image);
                                const isReadMore = readMoreStates[post.id];
                                const sanitizedContent = DOMPurify.sanitize(post.content || '');
                                const contentPreview = sanitizedContent.length > 300 ? sanitizedContent.substring(0, 300) + '...' : sanitizedContent;

                                const commentsToShow = expandedComments[post.id] ? postComments[post.id] : postComments[post.id]?.slice(0, 3);

                                return (
                                    <li key={post.id} className="post-item">
                                        <h3>
                                            <a href={`/posts/${post.slug}`}>{post.title}</a>
                                        </h3>
                                        <p className="post-description">{post.description}</p>
                                       
                                        <p className='post-date'><strong>Updated At:</strong> {new Date(post.updated_at).toLocaleDateString()}</p>


                                        {imageURL && (
                                            <img
                                                src={imageURL}
                                                alt={post.title}
                                                className="post-image"
                                            />
                                        )}
                                        <div
                                            dangerouslySetInnerHTML={{ __html: isReadMore ? sanitizedContent : contentPreview }}
                                            className="post-content"
                                        />
                                        <a
                                            href="#"
                                            onClick={(event) => toggleReadMore(post.id, event)}
                                            className="read-more-link"
                                        >
                                            {isReadMore ? 'Read Less' : 'Read More'}
                                        </a>

                                        <p className="author-container">
          {post.author?.profile?.profile_picture ? (
            <img 
              src={post.author.profile.profile_picture} 
              alt={`${post.author.username}'s profile`} 
              className="author-profile-image" 
            />
          ) : (
            <img 
              src="default-profile.png" 
              alt="Default profile" 
              className="author-profile-image" 
            />
          )}
          <div className="author-details">
            <div className="author-name">
              <span className="author-label">Written by:</span> {post.author?.username || 'Unknown'}
            </div>
            <div className="author-content">
              {/* You can add more content here if needed */}
            </div>
          </div>
        </p>

                

                                        <div className="comment-section">
                                            <h4>Comments:</h4>
                                            {postComments[post.id] && postComments[post.id].length > 0 ? (
                                                <ul>
                                                    {commentsToShow.map(comment => {
                                                        const sanitizedCommentContent = DOMPurify.sanitize(comment.content || '');

                                                        return (
                                                            <li key={comment.id}>
                                                                <p>
                                                                    <strong>{comment.author.username}:</strong> {sanitizedCommentContent}
                                                                </p>
                                                                <a
                                                                    href="#"
                                                                    onClick={(event) => {
                                                                        event.preventDefault();
                                                                        toggleReplyForm(comment.id);
                                                                    }}
                                                                    className="reply-link"
                                                                >
                                                                    {replyFormVisible[comment.id] ? 'Cancel Reply' : 'Reply'}
                                                                </a>
                                                                {replyFormVisible[comment.id] && (
                                                                    <div className="reply-form">
                                                                        <textarea
                                                                            value={newReply[comment.id] || ''}
                                                                            onChange={(e) => handleReplyChange(comment.id, e)}
                                                                            onKeyDown={(e) => {
                                                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                                                    e.preventDefault();
                                                                                    handleReplySubmit(comment.id);
                                                                                }
                                                                            }}
                                                                            placeholder="Add a reply..."
                                                                        />
                                                                        <button
                                                                            onClick={() => handleReplySubmit(comment.id)}
                                                                        >
                                                                            Submit Reply
                                                                        </button>
                                                                    </div>
                                                                )}
                                                                {commentReplies[comment.id] && commentReplies[comment.id].length > 0 && (
                                                                    <ul className="replies-list">
                                                                        {commentReplies[comment.id].map(reply => (
                                                                            <li key={reply.id}>
                                                                                <p>
                                                                                    <strong>{reply.author.username}:</strong> {DOMPurify.sanitize(reply.content || '')}
                                                                                </p>
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                )}
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                            ) : (
                                                <p>No comments yet</p>
                                            )}
                                            {postComments[post.id] && postComments[post.id].length > 3 && (
                                                <a
                                                    href="#"
                                                    onClick={(event) => toggleComments(post.id, event)}
                                                    className="read-more-link"
                                                >
                                                    {expandedComments[post.id] ? 'Show Less' : 'Show More'}
                                                </a>
                                                
                                            )}

                                            <div className="comment-form">
                                                <textarea
                                                    value={newComment[post.id] || ''}
                                                    onChange={(e) => handleCommentChange(post.id, e)}
                                                    onKeyDown={(e) => handleKeyDown(e, post.id)}
                                                    placeholder="Add a comment..."
                                                />
                                                <button
                                                    onClick={() => handleCommentSubmit(post.id)}
                                                >
                                                    Submit Comment
                                                </button>
                                            </div>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                        
                        {/* Load More Posts Button */}
                        {hasMorePosts && (
                            <div className="load-more-container">
                                <button 
                                    className="load-more-button" 
                                    onClick={loadMorePosts}
                                    disabled={loadingMore}
                                >
                                    {loadingMore ? 'Loading...' : 'Load More Posts'}
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <p>No posts found</p>
                )}
                
            </div>
            <div className="right-side">
                <SocialMediaLinks />
                <Profile />
                <TrendingTopics />
                {isAuthenticated && (
                    <button className="logout-button" onClick={handleLogout}>
                        Logout
                    </button>
                )}
               
            </div>
        </div>
    );
};

export default PostList;
