// SocialMediaLinks.js
import React from 'react';
import './SocialMediaLinks.css'; // Add CSS for styling the social media links
import linkedinIcon from './icons/linkedin.png';
import facebookIcon from './icons/facebook.png';
import instagramIcon from './icons/instagram.png';
import twitterIcon from './icons/twitter.png';
const SocialMediaLinks = () => {
    return (
        <div className="social-media-links">
            <a href="https://www.linkedin.com/in/raphael-kipsang" target="_blank" rel="noopener noreferrer">
            <img src={linkedinIcon} alt="LinkedIn" />
            </a>
            <a href="https://www.facebook.com/computersci3" target="_blank" rel="noopener noreferrer">
            <img src={facebookIcon} alt="Facebook" />
            </a>
            <a href="https://instagram.com/computersci3?igshid=ZDc4ODBmNjlmNQ==" target="_blank" rel="noopener noreferrer">
            <img src={instagramIcon} alt="Instagram" />
            </a>
            <a href="https://twitter.com/ruff_G" target="_blank" rel="noopener noreferrer">
            <img src={twitterIcon} alt="Twitter" />
            </a>
            {/* Add more social media links as needed */}
        </div>
    );
};

export default SocialMediaLinks;
