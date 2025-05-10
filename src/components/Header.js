import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import LogoutButton from './LogoutButton'; 
import './Header.css'; 

const Header = () => {
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState(null);
    const [searchInput, setSearchInput] = useState('');
    const dropdownRef = useRef(null);
    const overlayRef = useRef(null);
    const navigate = useNavigate();
    
    const toggleDropdown = () => {
        setDropdownOpen(!isDropdownOpen);
        if (!isDropdownOpen) {
            // When opening the dropdown, disable scrolling
            document.body.style.overflow = 'hidden';
        } else {
            // When closing the dropdown, enable scrolling
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
            try {
                const response = await axios.get(`https://raphsang.pythonanywhere.com/api/categories/`);
                setCategories(response.data);
            } catch (err) {
                setError('An error occurred while fetching categories');
            }
        };
        fetchCategories();
    }, []);

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
                        
                        {error && <p className="error-message">{error}</p>}
                        
                        {categories.length === 0 ? (
                            <p className="dropdown-item">No categories available</p>
                        ) : (
                            categories.map(category => (
                                <div 
                                    key={category.id} 
                                    className="dropdown-item"
                                    onClick={() => handleCategoryClick(category.id)}
                                >
                                    {category.name}
                                </div>
                            ))
                        )}
                        
                        <LogoutButton />
                    </div>
                </nav>
            </header>
        </>
    );
};

export default Header;
