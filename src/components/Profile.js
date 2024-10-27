import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; // Correct path to AuthContext
import './Profile.css'; // Import your CSS file

const ProfileList = () => {
    const [profiles, setProfiles] = useState([]);
    const [error, setError] = useState(null);
    const [editingProfile, setEditingProfile] = useState(null);
    const [updatedProfile, setUpdatedProfile] = useState({ user_name: '', bio: '' });
    const [profilePicture, setProfilePicture] = useState(null);
    const { token, user } = useAuth(); // Get token and user from context

    useEffect(() => {
        const fetchProfiles = async () => {
            try {
                const response = await axios.get('https://raphsang.pythonanywhere.com/api/profiles/', {
                    headers: { Authorization: token ? `Bearer ${token}` : '' }
                });
                setProfiles(response.data);
            } catch (err) {
                console.error('Error fetching profiles:', err.response ? err.response.data : err.message);
                setError('An error occurred while fetching profiles');
            }
        };

        fetchProfiles();
    }, [token]);

    const handleEditClick = (profile) => {
        setEditingProfile(profile);
        setUpdatedProfile({ user_name: profile.user_name, bio: profile.bio });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdatedProfile((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        setProfilePicture(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!editingProfile) return;

        const formData = new FormData();
        formData.append('user_name', updatedProfile.user_name);
        formData.append('bio', updatedProfile.bio);
        if (profilePicture) {
            formData.append('profile_picture', profilePicture);
        }

        try {
            await axios.put(`https://raphsang.pythonanywhere.com/api/profiles/${editingProfile.id}/`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            setEditingProfile(null);
            setUpdatedProfile({ user_name: '', bio: '' });
            setProfilePicture(null);
            // Refetch profiles after updating
            const response = await axios.get('https://raphsang.pythonanywhere.com/api/profiles/', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProfiles(response.data);
        } catch (err) {
            console.error('Error updating profile:', err.response ? err.response.data : err.message);
            setError('An error occurred while updating the profile');
        }
    };

    return (
        <div className="profile-list-container">
            {error && <p className="error-message">{error}</p>}
            {profiles.length > 0 ? (
                <div className="profile-list">
                    {profiles.map((profile) => (
                        <div key={profile.id} className="profile-item">
                            <img src={profile.profile_picture || 'default-profile.png'} alt="Profile" />
                            <h3>{profile.user_name}</h3>
                            <p>{profile.bio || 'No bio available'}</p>
                            {user && profile.user_id === user.id && ( // Check if logged-in user is the owner
                                <button onClick={() => handleEditClick(profile)}>Edit</button>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <p>No profiles found</p>
            )}

            {editingProfile && (
                <div className="profile-form">
                    <h2>Edit Profile</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="user_name">Username:</label>
                            <input
                                type="text"
                                id="user_name"
                                name="user_name"
                                value={updatedProfile.user_name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="bio">Bio:</label>
                            <textarea
                                id="bio"
                                name="bio"
                                value={updatedProfile.bio}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="profile_picture">Profile Picture:</label>
                            <input
                                type="file"
                                id="profile_picture"
                                name="profile_picture"
                                onChange={handleFileChange}
                            />
                        </div>
                        <button type="submit">Update Profile</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default ProfileList;
