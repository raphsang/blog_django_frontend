import React from 'react';
import Slider from 'react-slick';
import DOMPurify from 'dompurify';
import './SlidingPosts.css';

const SlidingPosts = ({ posts }) => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true, // Enable auto sliding
        autoplaySpeed: 4000 // Set auto slide interval to 3 seconds
    };

    return (
        <div className="sliding-posts-container">
            <Slider {...settings}>
                {posts.map(post => {
                    const sanitizedContent = DOMPurify.sanitize(post.content || '');
                    const imageURL = makeAbsoluteURL(post.image);
                    const postSlug = post.slug; // Assuming the slug is available in post data

                    return (
                        <div key={post.id} className="sliding-post">
                            <h3 className="post-title">{post.title}</h3>
                            <p className="post-description">{post.description}</p>
                            {imageURL && (
                                <img
                                    src={imageURL}
                                    alt={post.title}
                                    className="post-image"
                                />
                            )}
                            <a href={`/posts/${postSlug}`} className="read-more-link">Read More</a>
                        </div>
                    );
                })}
            </Slider>
        </div>
    );
};

const makeAbsoluteURL = (url) => {
    if (!url) return url;
    const baseURL = 'https://raphsang.pythonanywhere.com/media/';
    return url.startsWith('http') ? url : baseURL + url;
};

export default SlidingPosts;
