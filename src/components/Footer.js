import React, { useState } from 'react';
import axios from 'axios';
import './Footer.css';

const Footer = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [showDonationModal, setShowDonationModal] = useState(false);
    const [donationAmount, setDonationAmount] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('paypal');
    const [donationLoading, setDonationLoading] = useState(false);
    const [donationMessage, setDonationMessage] = useState('');

    // Handle newsletter subscription
    const handleSubscribe = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post('https://raphsang.pythonanywhere.com/api/subscribe/', { email });
            setMessage('Thank you for subscribing!');
            setEmail('');
        } catch (error) {
            console.error('Subscription error:', error);
            setMessage('Subscription failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Handle donation modal
    const openDonationModal = () => {
        setShowDonationModal(true);
    };

    const closeDonationModal = () => {
        setShowDonationModal(false);
        setDonationAmount('');
        setPhoneNumber('');
        setPaymentMethod('paypal');
        setDonationMessage('');
    };

    // Handle donation submission
    const handleDonation = async (e) => {
        e.preventDefault();
        setDonationLoading(true);
        setDonationMessage('');

        try {
            if (paymentMethod === 'mpesa') {
                // M-Pesa donation handling
                const mpesaData = {
                    phone: phoneNumber,
                    amount: donationAmount
                };

                const response = await axios.post('https://raphsang.pythonanywhere.com/api/mpesa-payment/', mpesaData);
                setDonationMessage('M-Pesa payment initiated! Please check your phone for the STK push.');
                
                // Clear form after successful submission
                setDonationAmount('');
                setPhoneNumber('');
            } else {
                // Redirect to PayPal with the amount
                window.open(`https://www.paypal.com/donate?business=kipsangraphael6@gmail.com&currency_code=USD&amount=${donationAmount}`, '_blank');
                setDonationMessage('Redirecting to PayPal...');
            }
        } catch (error) {
            console.error('Donation error:', error);
            setDonationMessage('Donation failed. Please try again.');
        } finally {
            setDonationLoading(false);
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
                            <li><a href="https://www.linkedin.com/in/raphael-kipsang/" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
                            <li><a href="https://www.facebook.com/computersci3" target="_blank" rel="noopener noreferrer">Facebook</a></li>
                            <li><a href="https://twitter.com/ruff_G" target="_blank" rel="noopener noreferrer">Twitter</a></li>
                            <li><a href="https://github.com/raphsang" target="_blank" rel="noopener noreferrer">Github</a></li>
                            <li><a href="https://portfolio-raphsang.vercel.app/" target="_blank" rel="noopener noreferrer">Portfolio</a></li>
                        </ul>
                    </div>
                    <div className="donation">
                        <h4>Support Us</h4>
                        <p>If you enjoy our content, please consider making a donation:</p>
                        <button 
                            onClick={openDonationModal} 
                            className="donate-button"
                        >
                            Donate Now
                        </button>
                    </div>
                </div>
            </div>

            {/* Donation Modal */}
            {showDonationModal && (
                <div className="donation-modal-overlay">
                    <div className="donation-modal">
                        <button className="close-modal" onClick={closeDonationModal}>×</button>
                        <h3>Make a Donation</h3>
                        <form onSubmit={handleDonation}>
                            <div className="payment-methods">
                                <label className={`payment-method ${paymentMethod === 'paypal' ? 'active' : ''}`}>
                                    <input 
                                        type="radio" 
                                        name="paymentMethod" 
                                        value="paypal"
                                        checked={paymentMethod === 'paypal'}
                                        onChange={() => setPaymentMethod('paypal')}
                                    />
                                    <span>PayPal</span>
                                </label>
                                <label className={`payment-method ${paymentMethod === 'mpesa' ? 'active' : ''}`}>
                                    <input 
                                        type="radio" 
                                        name="paymentMethod" 
                                        value="mpesa"
                                        checked={paymentMethod === 'mpesa'}
                                        onChange={() => setPaymentMethod('mpesa')}
                                    />
                                    <span>M-Pesa</span>
                                </label>
                            </div>

                            <div className="form-group">
                                <label htmlFor="donationAmount">Amount (USD)</label>
                                <input
                                    id="donationAmount"
                                    type="number"
                                    value={donationAmount}
                                    onChange={(e) => setDonationAmount(e.target.value)}
                                    placeholder="Enter amount"
                                    required
                                    min="1"
                                />
                            </div>

                            {paymentMethod === 'mpesa' && (
                                <div className="form-group">
                                    <label htmlFor="phoneNumber">Phone Number (Format: 254XXXXXXXXX)</label>
                                    <input
                                        id="phoneNumber"
                                        type="text"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        placeholder="254XXXXXXXXX"
                                        required
                                        pattern="^254[0-9]{9}$"
                                        title="Please enter a valid phone number starting with 254 followed by 9 digits"
                                    />
                                    <small>Enter your M-Pesa registered phone number starting with 254</small>
                                </div>
                            )}

                            <button 
                                type="submit" 
                                className="donate-submit-button" 
                                disabled={donationLoading}
                            >
                                {donationLoading ? 'Processing...' : `Donate via ${paymentMethod === 'mpesa' ? 'M-Pesa' : 'PayPal'}`}
                            </button>

                            {donationMessage && (
                                <p className="donation-message">{donationMessage}</p>
                            )}
                        </form>
                    </div>
                </div>
            )}
        </footer>
    );
};

export default Footer;
