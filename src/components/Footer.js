import React, { useState } from 'react';
import axios from 'axios';
import './Footer.css';

const Footer = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubscribe = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:8000/api/subscribe/', { email });
            setMessage('Thank you for subscribing!');
            setEmail('');
        } catch (error) {
            console.error('Subscription error:', error);
            setMessage('Subscription failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-left">
                    <p>&copy; {new Date().getFullYear()} My Blog. All rights reserved.</p>
                    <div className="about-contact">
                        <h4>About Us</h4>
                        <p>Welcome to My Blog, where we share insightful content on various topics. <a href="/about">Learn more</a>.</p>
                        <h4>Contact Us</h4>
                        <p>Email: <a href="mailto:kraftonerk2@gmail.com">contact@theg.com</a></p>
                    </div>
                </div>
                
                <div className="footer-right">
                    <div className="newsletter">
                        <h4>Subscribe to our Newsletter</h4>
                        <form onSubmit={handleSubscribe} className="subscribe-form">
                            <input 
                                type="email" 
                                placeholder="Enter your email" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                required 
                            />
                            <button type="submit" disabled={loading}>
                                {loading ? 'Subscribing...' : 'Subscribe'}
                            </button>
                        </form>
                        {message && <p className="subscribe-message">{message}</p>}
                    </div>
                    
                    <div className="social-media">
                        <h4>Follow Us</h4>
                        <ul>
                            <li><a href="https://wwww.linkedin.com/in/raphael-kipsang" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
                            <li><a href="https://www.facebook.com/computersci3" target="_blank" rel="noopener noreferrer">Facebook</a></li>
                            <li><a href="https://twitter.com/ruff_G" target="_blank" rel="noopener noreferrer">Twitter</a></li>
                            <li><a href="https:///instagram.com/computersci3?igshid=ZDc4ODBmNjlmNQ==" target="_blank" rel="noopener noreferrer">Instagram</a></li>
                            <li><a href="https://www.portfolio-raphsang.vercel.app/" target="_blank" rel="noopener noreferrer">Portfolio</a></li>
                        </ul>
                    </div>

                    <div className="donation">
                        <h4>Support Us</h4>
                        <p>If you enjoy our content, please consider making a donation:</p>
                        <a 
                            href="https://www.paypal.com/donate?business=kipsangraphael6@gmail.com&currency_code=USD" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="donate-button"
                        >
                            Donate via PayPal
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
