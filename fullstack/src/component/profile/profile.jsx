import React, { useState, useEffect } from 'react';
import './profile.css'; // Import CSS file for styling
import axios from 'axios'; // To handle image upload requests

const Profile = ({ user, setUser }) => {
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    email: user?.email || '',
    password: '', // For password changes
  });
  const [imageFile, setImageFile] = useState(null); // State to store selected image preview
  const [loading, setLoading] = useState(false); // State to manage loading
  const [editing, setEditing] = useState(false); // For toggling edit mode
  const [isUserLoading, setIsUserLoading] = useState(true); // State to manage user loading
  const defaultProfileImage = 'https://www.pphfoundation.ca/wp-content/uploads/2018/05/default-avatar.png';

  // Get the token from localStorage
  const token = localStorage.getItem("token");

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      if (!token) {
        setIsUserLoading(false);
        return;
      }

      try {
        const response = await axios.get("http://localhost:5000/api/user/profile", {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });
        setUser(response.data.user);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsUserLoading(false); // Set loading to false after fetch
      }
    };

    fetchUserData();
  }, [setUser, token]);

  // Handle input changes in the form
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle image changes
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(URL.createObjectURL(file));
      setLoading(true); // Set loading to true when uploading

      const formData = new FormData();
      formData.append("profileImage", file);
      formData.append("userId", user?._id); // Use optional chaining
      try {
        const response = await axios.post("http://localhost:5000/api/user/uploadProfileImage", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${token}`, // Include JWT token
          },
        });

        // Update user state with the new profile image
        setUser({ ...user, profileImage: response.data.profileImage });
      } catch (error) {
        console.error("Image upload failed:", error);
      } finally {
        setLoading(false); // Reset loading state
      }
    }
  };

  // Handle form submission (to update profile details)
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Send updated profile data to the backend
      const response = await axios.put(
        `http://localhost:5000/api/user/update`,
        { 
          firstName: formData.firstName,
          email: formData.email,
          password: formData.password ? formData.password : undefined, // Only send password if it's changed
          userId: user._id,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`, // Include JWT token
          },
        }
      );

      // Update the user object in the frontend state
      setUser(response.data);
      setEditing(false); // Exit edit mode after updating
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setLoading(false);
    }
  };

  // Build the full image URL if a profileImage is available
  const profileImageUrl = user?.profileImage 
    ? `http://localhost:5000/${user.profileImage}?t=${new Date().getTime()}` // Add timestamp to avoid caching issues
    : imageFile || defaultProfileImage;

  if (isUserLoading) {
    return <p>Loading...</p>; // Show a loading message while fetching user data
  }

  if (!token) {
    return <p>Please log in to see your profile.</p>; // Message when no token is found
  }

  return (
    <div className="profile-container">
      <h1 className="profile-title">User Profile</h1>
      {user ? (
        <div className="profile-info">
          {editing ? (
            <form onSubmit={handleFormSubmit} className="profile-edit-form">
              {/* Edit form for user details */}
              <div className="form-group">
                <label htmlFor="firstName">Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter new password (optional)"
                />
              </div>
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? 'Updating...' : 'Update Profile'}
              </button>
            </form>
          ) : (
            <div className="profile-details">
              <p className="profile-name">Name: {user.firstName}</p>
              <p className="profile-email">Email: {user.email}</p>
              <button onClick={() => setEditing(true)} className="edit-profile-btn">
                Edit Profile
              </button>
            </div>
          )}
          <div className="profile-image1-section">
            <img
              src={profileImageUrl}
              alt="Profile"
              className="profile-image1"
            />
            <div className="edit-overlay">
              <label htmlFor="image-upload" className="edit-button">
                Edit Profile Image
              </label>
              <input
                type="file"
                id="image-upload"
                accept="image/*"
                onChange={handleImageChange}
                className="file-input"
              />
            </div>
          </div>
          {loading && <p>Uploading image...</p>} {/* Show loading message */}
        </div>
      ) : (
        <p className="profile-login-message">Please log in to see your profile.</p>
      )}
    </div>
  );
};

export default Profile;
