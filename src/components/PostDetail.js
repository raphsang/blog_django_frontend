import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import DOMPurify from 'dompurify';
import './PostDetail.css'; // Import CSS

const makeAbsoluteURL = (url) => {
    if (!url) return url;
    const baseURL = 'http://localhost:8000/media/';
    return url.startsWith('http') ? url : baseURL + url;
};

const PostDetail = () => {
    const { postId } = useParams();
    const [post, setPost] = useState(null);
    const [error, setError] = useState(null);
    const [isReadMore, setIsReadMore] = useState(false);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await axios.get(`https://raphsang.pythonanywhere.com/api/posts/${postId}/`);
                console.log('Fetched post data:', response.data);
                
                if (response.data) {
                    setPost(response.data);
                } else {
                    setError('Post not found');
                }
            } catch (err) {
                console.error('Error fetching post details:', err);
                setError('An error occurred while fetching the post details');
            }
        };

        fetchPost();
    }, [postId]);

    if (error) return <p className="error-message">{error}</p>;
    if (!post) return <p>Loading...</p>;

    const imageURL = makeAbsoluteURL(post.image);

    // Sanitize HTML content before rendering
    const sanitizedHtml = DOMPurify.sanitize(post.content || '');
    
    // Calculate truncated content
    const contentPreview = sanitizedHtml.length > 300 ? sanitizedHtml.substring(0, 300) + '...' : sanitizedHtml;

    return (
        <div className="post-detail">
            <h3>{post.title}</h3>
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

            <p><strong>Updated At:</strong> {new Date(post.updated_at).toLocaleDateString()}</p>
            {imageURL && (
                <img
                    src={imageURL}
                    alt={post.title}
                    className="post-image"
                />
            )}
            <div
                dangerouslySetInnerHTML={{ __html: isReadMore ? sanitizedHtml : contentPreview }}
                className="post-content"
            />
            <button
                onClick={() => setIsReadMore(!isReadMore)}
                className="read-more-btn"
            >
                {isReadMore ? 'Read Less' : 'Read More'}
            </button>
        </div>
    );
};

export default PostDetail;
