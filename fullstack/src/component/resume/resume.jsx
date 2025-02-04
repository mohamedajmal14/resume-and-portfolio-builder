import React, { useState } from 'react';
import './resume.css';

function Resume() {
  const [page, setPage] = useState('promo'); // State to track current page (promo or form)

  const [personalDetails, setPersonalDetails] = useState({
    name: '',
    title: '',
    email: '',
    phone: '',
    location: ''
  });

  const [education, setEducation] = useState([
    { degree: '', institution: '', year: '' }
  ]);

  const [experience, setExperience] = useState([
    { company: '', role: '', duration: '', responsibilities: '' }
  ]);

  const [skills, setSkills] = useState('');

  const handleInputChange = (e, index, section) => {
    const { name, value } = e.target;
    if (section === 'personal') {
      setPersonalDetails({ ...personalDetails, [name]: value });
    } else if (section === 'education') {
      const updatedEducation = [...education];
      updatedEducation[index][name] = value;
      setEducation(updatedEducation);
    } else if (section === 'experience') {
      const updatedExperience = [...experience];
      updatedExperience[index][name] = value;
      setExperience(updatedExperience);
    }
  };

  const addEducation = () => {
    setEducation([...education, { degree: '', institution: '', year: '' }]);
  };

  const addExperience = () => {
    setExperience([...experience, { company: '', role: '', duration: '', responsibilities: '' }]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Resume Submitted!");
  };

  return (
    <div className="bb">
      {page === 'promo' ? (
        // Promo Section
        <div className="promo-container">
          <div className="promo-image">
            <img src="https://resume.io/assets/landing/builder/promo/resume/visual-6074098d8e832e57ead0cb6f735d68ebdabf9790b82bf957fc812d382d3d0fbe.svg" alt="Resume Illustration" />
          </div>
          <div className="promo-text">
            <h1>Create a resume to land your next job</h1>
            <p>Building a resume is a crucial step in your job search process. A well-crafted resume serves as your personal marketing tool, highlighting your skills, experiences, and accomplishments to potential employers.</p>
            <p>
              We have developed a <b>Resume Builder</b> based on the preferences of thousands of users. The goal is simple: help you land that dream job interview! Get an advantage in the modern professional environment.
            </p>
            <button
              className="build-resume-btn"
              onClick={() => setPage('form')} // Switch to form page when button is clicked
            >
              Build Your Resume
            </button>
          </div>
        </div>
      ) : (
        // Resume Builder Section
        <div className="resume-builder">
          <div className="resume-form">
            <h1>Resume Builder</h1>
            <form onSubmit={handleSubmit}>
              <h2>Personal Details</h2>
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={personalDetails.name}
                onChange={(e) => handleInputChange(e, null, 'personal')}
              />
              <input
                type="text"
                name="title"
                placeholder="Title"
                value={personalDetails.title}
                onChange={(e) => handleInputChange(e, null, 'personal')}
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={personalDetails.email}
                onChange={(e) => handleInputChange(e, null, 'personal')}
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone"
                value={personalDetails.phone}
                onChange={(e) => handleInputChange(e, null, 'personal')}
              />
              <input
                type="text"
                name="location"
                placeholder="Location"
                value={personalDetails.location}
                onChange={(e) => handleInputChange(e, null, 'personal')}
              />

              <h2>Education</h2>
              {education.map((edu, index) => (
                <div key={index}>
                  <input
                    type="text"
                    name="degree"
                    placeholder="Degree"
                    value={edu.degree}
                    onChange={(e) => handleInputChange(e, index, 'education')}
                  />
                  <input
                    type="text"
                    name="institution"
                    placeholder="Institution"
                    value={edu.institution}
                    onChange={(e) => handleInputChange(e, index, 'education')}
                  />
                  <input
                    type="text"
                    name="year"
                    placeholder="Year"
                    value={edu.year}
                    onChange={(e) => handleInputChange(e, index, 'education')}
                  />
                </div>
              ))}
              <button type="button" className='bbut' onClick={addEducation}>Add Education</button>

              <h2>Work Experience</h2>
              {experience.map((exp, index) => (
                <div key={index}>
                  <input
                    type="text"
                    name="company"
                    placeholder="Company"
                    value={exp.company}
                    onChange={(e) => handleInputChange(e, index, 'experience')}
                  />
                  <input
                    type="text"
                    name="role"
                    placeholder="Role"
                    value={exp.role}
                    onChange={(e) => handleInputChange(e, index, 'experience')}
                  />
                  <input
                    type="text"
                    name="duration"
                    placeholder="Duration"
                    value={exp.duration}
                    onChange={(e) => handleInputChange(e, index, 'experience')}
                  />
                  <textarea
                    name="responsibilities"
                    placeholder="Responsibilities"
                    value={exp.responsibilities}
                    onChange={(e) => handleInputChange(e, index, 'experience')}
                  />
                </div>
              ))}
              <button type="button" className='bbut' onClick={addExperience}>Add Experience</button>

              <h2>Skills</h2>
              <input
                type="text"
                name="skills"
                placeholder="Skills (comma separated)"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
              />

              <button type="submit" className='bbut'>Submit</button>
            </form>
          </div>

          {/* Resume Preview Section */}
          <div className="resume-preview">
            <div className="resume-header">
              <h1>{personalDetails.name}</h1>
              <h2>{personalDetails.title}</h2>
              <p>{personalDetails.phone} | {personalDetails.email} | {personalDetails.location}</p>
            </div>

            <div className="resume-section">
              <h3>Education</h3>
              {education.map((edu, index) => (
                <div key={index}>
                  <p><strong>{edu.degree}</strong>, {edu.institution} ({edu.year})</p>
                </div>
              ))}
            </div>

            <div className="resume-section">
              <h3>Experience</h3>
              {experience.map((exp, index) => (
                <div key={index}>
                  <p><strong>{exp.role}</strong> at {exp.company} ({exp.duration})</p>
                  <p>{exp.responsibilities}</p>
                </div>
              ))}
            </div>

            <div className="resume-section">
              <h3>Skills</h3>
              <p>{skills}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Resume;