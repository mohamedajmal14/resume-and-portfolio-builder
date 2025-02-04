import React, { useState } from 'react';
import axios from 'axios'; // To handle requests
import Link from 'react-dom';

const PortfolioForm = ({ user, setUser }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    technologies: '',
    demoLink: '',
    githubLink: '',
  });
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Get the token from localStorage
  const token = localStorage.getItem("token");

  // Handle input changes in the form
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    // Clear error message on input change
    if (errorMessage) {
      setErrorMessage('');
    }
  };

  // Validate URL format (basic example)
  const validateURL = (url) => {
    const pattern = new RegExp('^(https?://)');
    return pattern.test(url);
  };

  // Handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    // Validate demoLink and githubLink
    if (formData.demoLink && !validateURL(formData.demoLink)) {
      setErrorMessage('Invalid demo link format.');
      setLoading(false);
      return;
    }

    if (formData.githubLink && !validateURL(formData.githubLink)) {
      setErrorMessage('Invalid GitHub link format.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:5000/api/portfolio/add',
        {
          ...formData,
          userId: user._id, // Attach user ID to the portfolio data
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`, // Include JWT token
          },
        }
      );

      // Update user state or handle response as needed
      setUser((prevUser) => ({
        ...prevUser,
        portfolio: [...(prevUser.portfolio || []), response.data], // Add new portfolio item to user's portfolio
      }));

      setSuccessMessage('Portfolio item added successfully!');
      setFormData({
        title: '',
        description: '',
        technologies: '',
        demoLink: '',
        githubLink: '',
      }); // Reset form fields
    } catch (error) {
      console.error("Error adding portfolio item:", error.response ? error.response.data : error);
      setErrorMessage('Failed to add portfolio item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="portfolio-form-container">
      <h2>Add Portfolio Item</h2>
      <form onSubmit={handleFormSubmit} className="portfolio-form">
        <div className="form-group">
          <label htmlFor="title">Project Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="technologies">Technologies Used</label>
          <input
            type="text"
            id="technologies"
            name="technologies"
            value={formData.technologies}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="demoLink">Live Demo Link</label>
          <input
            type="url"
            id="demoLink"
            name="demoLink"
            value={formData.demoLink}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="githubLink">GitHub Repository Link</label>
          <input
            type="url"
            id="githubLink"
            name="githubLink"
            value={formData.githubLink}
            onChange={handleInputChange}
          />
        </div>
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Adding...' : 'Add Portfolio Item'}
        </button>
        <Link to='/portfoliopage'><button type='submit'>sub</button></Link>
        {successMessage && <p className="success-message">{successMessage}</p>}
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </form>
    </div>
  );
};

export default PortfolioForm;
