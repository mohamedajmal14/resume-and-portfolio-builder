import React from 'react'; 
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate for programmatic navigation
import './Navbar.css'; 

const Navbar = ({ user, setUser }) => {
    const navigate = useNavigate(); // Initialize useNavigate
    const defaultProfileImage = 'https://www.pphfoundation.ca/wp-content/uploads/2018/05/default-avatar.png'; // Default profile image URL

    // Build the full image URL if a profileImage exists
    const profileImageUrl = user?.profileImage ? `http://localhost:5000/${user.profileImage}` : defaultProfileImage;

    const handleLogout = () => {
        localStorage.removeItem('token'); // Clear the token from local storage
        setUser(null); // Clear user state
        navigate('/login'); // Redirect to login page after logout
    };

    return (
      <nav className="navbar">
        <div className="navbar-logo">
          <Link to="/">Resume & Portfolio Builder</Link>
        </div>
        <ul className="navbar-links">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/features">Features</Link>
          </li>
          <li>
            <Link to="/contact">Contact</Link>
          </li>
        </ul>
        <div className="navbar-cta">
          {user ? (
            <>
              <Link to="/profile" className="profile-icon">
                <img 
                  src={profileImageUrl} 
                  alt="Profile" 
                  className="profile-image" 
                />
              </Link>
              <button onClick={handleLogout} className="logout-button">
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="cta-button">
              Get Started
            </Link>
          )}
        </div>
      </nav>
    );
};

export default Navbar;
