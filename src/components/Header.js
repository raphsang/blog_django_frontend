import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import LogoutButton from './LogoutButton'; 
import './Header.css'; 

// Simple icon components (you can replace these with actual icon components if you have them)
const HomeIcon = () => <div className="dropdown-item-icon">🏠</div>;
const NewsIcon = () => <div className="dropdown-item-icon">📰</div>;
const UserIcon = () => <div className="dropdown-item-icon">👤</div>;
const SettingsIcon = () => <div className="dropdown-item-icon">⚙️</div>;
const BookmarkIcon = () => <div className="dropdown-item-icon">🔖</div>;

const Header = () => {
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState(null);
    const [searchInput, setSearchInput] = useState('');
    const [darkMode, setDarkMode] = useState(false);
    const [notifications, setNotifications] = useState(3); // Example notification count
    const [isLoading, setIsLoading] = useState(true);
    
    const dropdownRef = useRef(null);
    const overlayRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();
    
    // Get current category from URL if present
    const getCurrentCategoryId = () => {
        const params = new URLSearchParams(location.search);
        return params.get('category');
    };
    
    const toggleDropdown = () => {
        setDropdownOpen(!isDropdownOpen);
        if (!isDropdownOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    };
    
    const closeDropdown = () => {
        setDropdownOpen(false);
        document.body.style.overflow = '';
    };
    
    const handleSearchChange = (event) => {
        setSearchInput(event.target.value);
    };
    
    const handleSearchSubmit = (event) => {
        event.preventDefault();
        navigate(`/posts?search=${encodeURIComponent(searchInput)}`);
        closeDropdown();
    };
    
    const handleCategoryClick = (categoryId) => {
        closeDropdown();
        navigate(`/posts?category=${categoryId}`);
    };
    
    const handlePostsClick = () => {
        closeDropdown();
        navigate('/posts');
    };
    
    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        // You would also implement actual dark mode logic here
        // document.body.classList.toggle('dark-mode');
    };
    
    // Example user info - replace with actual auth logic
    const user = {
        name: "Guest User",
        initial: "G",
        isLoggedIn: false
    };
    
    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isDropdownOpen && 
                dropdownRef.current && 
                !dropdownRef.current.contains(event.target) &&
                !event.target.classList.contains('dropdown-button')) {
                closeDropdown();
            }
        };
        
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isDropdownOpen]);
    
    // Close dropdown when window is resized to desktop size
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 768 && isDropdownOpen) {
                closeDropdown();
            }
        };
        
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [isDropdownOpen]);
    
    // Fetch categories
    useEffect(() => {
        const fetchCategories = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(`https://raphsang.pythonanywhere.com/api/categories/`);
                setCategories(response.data);
                setError(null);
            } catch (err) {
                setError('An error occurred while fetching categories');
                setCategories([]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCategories();
    }, []);

    // Get current category ID
    const currentCategoryId = getCurrentCategoryId();

    return (
        <>
            {/* Overlay for mobile menu backdrop */}
            <div 
                ref={overlayRef}
                className={`menu-overlay ${isDropdownOpen ? 'active' : ''}`} 
                onClick={closeDropdown}
            />
            
            <header className="header">
                <div className="header-title">
                    <Link
                        to="/"
                        className="home-link"
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    >
                        ƬheUncensored
                    </Link>
                </div>
                
                <form onSubmit={handleSearchSubmit} className="search-form">
                    <input
                        type="text"
                        value={searchInput}
                        onChange={handleSearchChange}
                        placeholder="search..."
                        className="search-input"
                    />
                </form>
                
                <nav className="nav">
                    <button 
                        onClick={toggleDropdown} 
                        className="dropdown-button"
                        aria-label="Toggle navigation menu"
                        aria-expanded={isDropdownOpen}
                    >
                        ☰
                    </button>
                    
                    <div 
                        ref={dropdownRef}
                        className={`dropdown-menu ${isDropdownOpen ? 'active' : ''}`}
                    >
                        <button 
                            onClick={closeDropdown} 
                            className="dropdown-close"
                            aria-label="Close menu"
                        >
                            ✕
                        </button>
                        
                        {/* User Profile Area */}
                        <div className="dropdown-user-area">
                            <div className="user-avatar">{user.initial}</div>
                            <div className="user-info">
                                <span className="user-name">{user.name}</span>
                                <span className="user-status">{user.isLoggedIn ? 'Logged In' : 'Guest'}</span>
                            </div>
                        </div>
                        
                        {/* Main Navigation Items */}
                        <div className="dropdown-item" onClick={() => { navigate('/'); closeDropdown(); }}>
                            <HomeIcon />
                            Home
                        </div>
                        
                        <div className="dropdown-item" onClick={handlePostsClick}>
                            <NewsIcon />
                            All Posts
                        </div>
                        
                        <div className="dropdown-item" onClick={() => { navigate('/bookmarks'); closeDropdown(); }}>
                            <BookmarkIcon />
                            Bookmarks
                            {notifications > 0 && <span className="dropdown-badge">{notifications}</span>}
                        </div>
                        
                        {/* Categories Section */}
                        <div className="dropdown-section-header">Categories</div>
                        
                        {isLoading ? (
                            <div className="dropdown-item">Loading categories...</div>
                        ) : error ? (
                            <div className="dropdown-item error-message">{error}</div>
                        ) : categories.length === 0 ? (
                            <div className="dropdown-item">No categories available</div>
                        ) : (
                            categories.map(category => (
                                <div 
                                    key={category.id} 
                                    className={`dropdown-item ${currentCategoryId == category.id ? 'active' : ''}`}
                                    onClick={() => handleCategoryClick(category.id)}
                                >
                                    <div className="dropdown-item-icon">📂</div>
                                    {category.name}
                                </div>
                            ))
                        )}
                        
                        {/* User Account Section */}
                        <div className="dropdown-section-header">Account</div>
                        
                        <div className="dropdown-item" onClick={() => { navigate('/profile'); closeDropdown(); }}>
                            <UserIcon />
                            Profile
                        </div>
                        
                        <div className="dropdown-item" onClick={() => { navigate('/settings'); closeDropdown(); }}>
                            <SettingsIcon />
                            Settings
                        </div>
                        
                        {/* Dark Mode Toggle */}
                        <div className="theme-toggle">
                            <span>Dark Mode</span>
                            <label className="toggle-switch">
                                <input 
                                    type="checkbox" 
                                    checked={darkMode} 
                                    onChange={toggleDarkMode}
                                />
                                <span className="toggle-slider"></span>
                            </label>
                        </div>
                        
                        {/* Logout Button */}
                        <LogoutButton />
                    </div>
                </nav>
            </header>
        </>
    );
};

export default Header;
