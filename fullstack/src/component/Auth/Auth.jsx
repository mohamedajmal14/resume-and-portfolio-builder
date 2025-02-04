import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import styled from "styled-components";
import axios from "axios"; // Import axios for API requests
import "./Auth.css";

function Auth({ setUser }) {
  const navigate = useNavigate(); // Initialize useNavigate
  const [isSignIn, setIsSignIn] = useState(true);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
  
    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email: formData.email,
        password: formData.password,
      });
      setSuccessMessage(response.data.message);
      const token = response.data.token; // Assuming the response includes a JWT token
  
      // Store token and user data in localStorage
      localStorage.setItem("token", token); // Save token in localStorage
      localStorage.setItem("user", JSON.stringify(response.data.user)); // Save user data
  
      setUser(response.data.user); // Set user state on successful login
      navigate('/home'); // Redirect to home on successful login
      setFormData({ firstName: "", lastName: "", email: "", password: "", confirmPassword: "" }); // Reset form
    } catch (error) {
      setErrorMessage(error.response?.data.message || "Login failed");
      console.error('Login Error:', error); // Detailed logging
    }
  };
  

  const handleSignup = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
  
    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      return setErrorMessage("Passwords do not match");
    }
  
    try {
      // Send all necessary form data including confirmPassword
      const response = await axios.post("http://localhost:5000/api/auth/signup", {
        firstName: formData.firstName,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword, // Include confirmPassword here
      });
  
      setSuccessMessage(response.data.message);
      
      // Store token and user data in localStorage
      const token = response.data.token; // Assuming the response includes a JWT token
      localStorage.setItem("token", token); // Save token in localStorage
      localStorage.setItem("user", JSON.stringify(response.data.user)); // Save user data
  
      setUser(response.data.user); // Set user state on successful signup
      navigate('/home'); // Redirect to home on successful signup
      setFormData({ firstName: "", email: "", password: "", confirmPassword: "" }); // Reset form
    } catch (error) {
      setErrorMessage(error.response?.data.message || "Signup failed");
      console.error('Signup Error:', error); // Detailed logging
    }
  };
  
  

  return (
    <div className="ak">
      <Container>
        <SignUpContainer signingIn={isSignIn}>
          <Form onSubmit={handleSignup}>
            <Title>Create Account</Title>
            <Input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} required />
            <Input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
            <Input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
            <Input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} required /><br />
            <Button type="submit">Sign Up</Button>
            {errorMessage && <Error>{errorMessage}</Error>}
            {successMessage && <Success>{successMessage}</Success>}
          </Form>
        </SignUpContainer>
        <SignInContainer signingIn={isSignIn}>
          <Form onSubmit={handleLogin}>
            <Title>Sign In</Title>
            <Input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
            <Input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
            <Anchor href="#">Forgot your password?</Anchor>
            <Button type="submit">Sign In</Button>
            {errorMessage && <Error>{errorMessage}</Error>}
            {successMessage && <Success>{successMessage}</Success>}
          </Form>
        </SignInContainer>
        <OverlayContainer signingIn={isSignIn}>
          <Overlay signingIn={isSignIn}>
            <LeftOverlayPanel signingIn={isSignIn}>
              <Title>Welcome Back!</Title>
              <img src="https://i.postimg.cc/tR1zCGPV/1728108380463.png" alt="Welcome" style={{ width: '100%', height: 'auto' }} />
              <RightArrowContainer onClick={() => setIsSignIn(true)}>Sign In</RightArrowContainer>
            </LeftOverlayPanel>
            <RightOverlayPanel signingIn={isSignIn}>
              <Title>New User?</Title>
              <img src="https://i.postimg.cc/tR1zCGPV/1728108380463.png" alt="Hello" style={{ width: '100%', height: 'auto' }} /><br />
              <LeftArrowContainer onClick={() => setIsSignIn(false)}>Sign Up</LeftArrowContainer>
            </RightOverlayPanel>
          </Overlay>
        </OverlayContainer>
      </Container>
    </div>
  );
}

const Container = styled.div`
  border-radius: 10px;
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
  position: relative;
  overflow: hidden;
  width: 678px;
  max-width: 100%;
  min-height: 450px;
`;


const SignUpContainer = styled.div`
  position: absolute;
  top: 0;
  height: 100%;
  transition: all 0.6s ease-in-out;
  left: 0;
  width: 50%;
  opacity: 0;
  z-index: 1;
  ${props =>
    props.signingIn !== true
      ? `
  transform: translateX(100%);
  opacity: 1;
  z-index: 5;
  `
      : null}
`;

const SignInContainer = styled.div`
  position: absolute;
  top: 0;
  height: 100%;
  transition: all 0.6s ease-in-out;
  left: 0;
  width: 50%;
  z-index: 2;
  ${props => (props.signingIn !== true ? `transform: translateX(100%);` : null)}
`;

const Form = styled.form`
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 50px;
  height: 100%;
  text-align: center;
`;

const Title = styled.h1`
  font-weight: bold;
  margin: 0;
  margin-bottom: 15px;
`;

const Input = styled.input`
  background-color: #eee;
  border: 1px solid #5942AA;
  padding: 12px 15px;
  margin: 8px 0;
  width: 100%;
  border-radius: 20px;
`;

const Button = styled.button`
  border-radius: 20px;
  border: 1px solid #5942AA;
  background-color: #5942AA;
  color: #ffffff;
  font-size: 13px;
  font-weight: bold;
  padding: 12px 45px;
  letter-spacing: 1px;
  text-transform: uppercase;
  transition: background-color 0.3s ease, transform 80ms ease-in;
  
  /* Change cursor to pointer */
  cursor: pointer;

  &:active {
    transform: scale(0.95);
  }

  &:focus {
    outline: none;
  }

  /* Hover effect */
  &:hover {
    background-color: #5942AA ; /* Change background color on hover */
    color: #ff4b2b; /* Change text color on hover if needed */
    border-color: #5942AA ; /* Optional: change border color */
  }
`;



const GhostButton = styled(Button)`
  background-color: 5942AA;
  border-color: #5942AA;
`;

const Anchor = styled.a`
  color: #333;
  font-size: 14px;
  text-decoration: none;
  margin: 15px 0;
`;

const OverlayContainer = styled.div`
  position: absolute;
  top: 0;
  left: 50%;
  width: 50%;
  height: 100%;
  overflow: hidden;
  transition: transform 0.6s ease-in-out;
  z-index: 100;
  ${props =>
    props.signingIn !== true ? `transform: translateX(-100%);` : null}
`;

const Overlay = styled.div`
  background: linear-gradient( 109.6deg,  rgba(112,246,255,0.33) 11.2%, rgba(221,108,241,0.26) 42%, rgba(229,106,253,0.71) 71.5%, rgba(123,183,253,1) 100.2% ););
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 0 0;
  color: #ffffff;
  position: relative;
  left: -100%;
  height: 100%;
  width: 200%;
  transform: translateX(0);
  transition: transform 0.6s ease-in-out;
  ${props => (props.signingIn !== true ? `transform: translateX(50%);` : null)}
`;

const OverlayPanel = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 40px;
  text-align: center;
  top: 0;
  height: 100%;
  width: 50%;
  transform: translateX(0);
  transition: transform 0.6s ease-in-out;
`;

const LeftOverlayPanel = styled(OverlayPanel)`
  transform: translateX(-20%);
  ${props => (props.signingIn !== true ? `transform: translateX(0);` : null)}
`;

const RightOverlayPanel = styled(OverlayPanel)`
  right: 0;
  transform: translateX(0);
  ${props => (props.signingIn !== true ? `transform: translateX(20%);` : null)}
`;

const Paragraph = styled.p`
  font-size: 14px;
  margin: 20px 0;
`;

const Error = styled.p`
  color: red;
  font-size: 12px;
`;

const Success = styled.p`
  color: green;
  font-size: 12px;
`;

const RightArrowContainer = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateX(5px);
  }

  &::after {
    content: '➔'; /* Right arrow symbol */
    font-size: 24px; /* Adjust the size as needed */
    margin-left: 5px;
    transition: color 0.3s ease;
  }

  &:hover::after {
    color: #ff4b2b; /* Change color on hover */
  }
`;

const LeftArrowContainer = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateX(-5px);
  }

  &::before {
    content: '➔'; /* Left arrow symbol */
    font-size: 24px; /* Adjust the size as needed */
    margin-right: 5px;
    transition: color 0.3s ease;
    transform: rotate(180deg); /* Rotate to face left */
  }

  &:hover::before {
    color: #ff4b2b; /* Change color on hover */
  }
`;



export default Auth;
