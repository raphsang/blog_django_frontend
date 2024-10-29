import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import PostList from './components/PostList';
import PostDetail from './components/PostDetail';
import Search from './components/Search';
import Signup from './components/Signup';
import CategoryList from './components/CategoryList';
import Header from './components/Header';
import Footer from './components/Footer';
import LogoutButton from './components/LogoutButton'; // Import LogoutButton component
import { AuthProvider, useAuth } from './context/AuthContext'; // Import AuthProvider and useAuth
import Profile from './components/Profile'; // Import Profile component
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const App = () => {
    const [searchResults, setSearchResults] = useState([]);

    const handleLogin = () => {
        // Handle login functionality here
    };

    const handleSignup = () => {
        // Handle signup functionality here
    };

    const handleSearch = (results) => {
        console.log('Search results:', results); // Debugging log
        setSearchResults(results);
    };

    return (
        <AuthProvider>
            <Router>
                <div>
                    <Header />
                    <main style={{ padding: '20px' }}>
                        <Routes>
                            <Route path="/" element={<Search onSearch={handleSearch} />} />
                            <Route path="/login" element={<Login onLogin={handleLogin} />} />
                            <Route path="/signup" element={<Signup onSignup={handleSignup} />} />
                            <Route path="/categories" element={<CategoryList />} />
                            <Route path="/posts" element={<PostList posts={searchResults} />} />
                            <Route path="/posts/:postId" element={<PostDetail />} />
                            <Route path="/profile/:id" element={<Profile />} />
                        </Routes>
                    </main>
                    <Footer />
                </div>
            </Router>
        </AuthProvider>
    );
};

export default App;
