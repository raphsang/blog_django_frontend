import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import LogoutButton from './LogoutButton'; 
import './Header.css'; 

const Header = () => {
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState(null);
    const [searchInput, setSearchInput] = useState('');
    const navigate = useNavigate();

    const toggleDropdown = () => setDropdownOpen(!isDropdownOpen);

    const handleBackClick = () => {
        setDropdownOpen(false); // Close the dropdown
    };

    const handleSearchChange = (event) => {
        setSearchInput(event.target.value);
    };

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        navigate(`/posts?search=${encodeURIComponent(searchInput)}`);
        setDropdownOpen(false); 
    };

    const handleCategoryClick = (categoryId) => {
        setDropdownOpen(false); 
        navigate(`/posts?category=${categoryId}`);
    };

    const handlePostsClick = () => {
        setDropdownOpen(false); 
        navigate('/posts');
    };

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
        <header className="header">
        <div className="header-title">
    <Link
        to="/"
        className="home-link"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    >
        ⤊Ƭheↅ
    </Link>
</div>

            <nav className="nav">
                <form onSubmit={handleSearchSubmit} className="search-form">
                    <input
                        type="text"
                        value={searchInput}
                        onChange={handleSearchChange}
                        placeholder="🔍search"
                        className="search-input"
                    />
                </form>
                <div className="nav-link dropdown">
                    <button onClick={toggleDropdown} className="dropdown-button">
                        ☰
                    </button>
                    {isDropdownOpen && (
                        <div className="dropdown-menu">
                            <button onClick={handleBackClick} className="back-button">← Back</button>
                            { /*<Link to="/posts" className="dropdown-item" onClick={handlePostsClick}> 
                                Posts
                            </Link>*/}
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
                    )}
                </div>
            </nav>
        </header>
    );
};

export default Header;
