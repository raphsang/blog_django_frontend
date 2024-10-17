import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './CategoryList.css'; // Import the CSS file

const CategoryList = () => {
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/categories/');
                setCategories(response.data);
            } catch (err) {
                setError('An error occurred while fetching categories');
            }
        };

        fetchCategories();
    }, []);

    return (
        <div className="category-list-container">
            <h2>Categories</h2>
            {error && <p className="error-message">{error}</p>}
            <ul>
                {categories.map(category => (
                    <li key={category.id}>
                        <Link to={`/posts?category=${category.id}`}>{category.name}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CategoryList;
