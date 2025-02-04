import React, { useState, useEffect } from 'react';
import './App.css';
import Auth from './component/Auth/Auth';
import { Routes, Route } from 'react-router-dom';
import Home from './component/home/home';
import Navbar from './component/navbar/Navbar';
import Profile from './component/profile/profile';
import jwtDecode from 'jwt-decode';
import Resume from './component/resume/resume';
import PortfolioForm from './component/portfolio/portfolio';
import PortfolioPage from './component/portfolio/portfoliopage';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token'); // Retrieve token from localStorage
    const userData = localStorage.getItem('user'); // Retrieve user data from localStorage

    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log('Decoded token:', decoded);
        
        // Check if the user data exists in localStorage and set user state
        if (userData) {
          setUser(JSON.parse(userData)); // Set user state
        } else {
          // If user data does not exist, set user state to the decoded token if it contains user info
          setUser(decoded); // Set user state from decoded token if needed
        }
      } catch (error) {
        console.error('Invalid token', error);
        // Optionally, you can clear the token and user from localStorage on invalid token
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, []);

  return (
    <div className="App">
      <Navbar user={user} setUser={setUser} />
      <Routes>
        <Route path='/login' element={<Auth setUser={setUser} />} />
        <Route path='/home' element={<Home user={user} />} />
        <Route path='/' element={<Home user={user} />} />
        <Route path='/profile' element={<Profile user={user} setUser={setUser} />} />
        <Route path='resume' element={<Resume user={user} />} />
        <Route path='/portfolio' element={ <PortfolioForm user={user} setUser={setUser} />} />
        <Route path='/portfoliopage' element={ <PortfolioPage user={user} />} />
      </Routes>
    </div>
  );
}

export default App;
