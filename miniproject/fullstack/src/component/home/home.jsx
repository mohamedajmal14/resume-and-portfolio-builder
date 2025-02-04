import React from 'react';
import './home.css'; // Make sure to import the CSS file
import { Link } from 'react-router-dom';


const Home = () => {
  return (
    <div className='ho'>
    <div className="home-container">
      <div className="hero-section">
        <h1 className='ho1'>Build Your Professional Resume & Portfolio</h1>
        <p>Create a stunning resume and portfolio to showcase your skills and accomplishments.</p>
      </div>

      <div className="features-section">
        <Link to='/Resume'><div className="feature">
          <h2>Create Resume</h2>
          <p>Easily create a professional resume using our pre-designed templates and customization options.</p>
        </div></Link>
        <Link to='/portfolio'><div className="feature">
          <h2>Build Portfolio</h2>
          <p>Showcase your projects and achievements with an impressive portfolio layout.</p>
        </div></Link>
      </div>
    </div>
    </div>
  );
}

export default Home;
