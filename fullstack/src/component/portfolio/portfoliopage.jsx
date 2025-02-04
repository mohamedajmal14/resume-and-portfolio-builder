import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './portfoliopage.css'

const PortfolioPage = ({ user }) => {
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch user's portfolio items on component mount
  useEffect(() => {
    const fetchPortfolioItems = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(`http://localhost:5000/api/portfolio/user/${user._id}`, {
          headers: {
            "Authorization": `Bearer ${token}`, // Include JWT token
          },
        });
        setPortfolioItems(response.data);
      } catch (error) {
        console.error("Error fetching portfolio items:", error);
        setErrorMessage('Failed to load portfolio items. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolioItems();
  }, [user._id]);

  if (loading) return <p>Loading...</p>;
  if (errorMessage) return <p className="error-message">{errorMessage}</p>;

  return (
    <div className="portfolio-page">
      <header className="portfolio-header">
        <h1>{user.firstName}'s Portfolio</h1>
        {user.profileImage && (
          <img src={`http://localhost:5000/${user.profileImage}`} alt={`${user.firstName}'s profile`} className="profile-image" />
        )}
      </header>

      <section className="portfolio-items">
        <h2>Portfolio Items</h2>
        {portfolioItems.length === 0 ? (
          <p>No portfolio items found.</p>
        ) : (
          <div className="portfolio-grid">
            {portfolioItems.map(item => (
              <div key={item._id} className="portfolio-item">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <p><strong>Technologies:</strong> {item.technologies}</p>
                {item.demoLink && <a href={item.demoLink} target="_blank" rel="noopener noreferrer">Live Demo</a>}
                {item.githubLink && <a href={item.githubLink} target="_blank" rel="noopener noreferrer">GitHub Repo</a>}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default PortfolioPage;
