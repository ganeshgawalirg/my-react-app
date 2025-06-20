import React, { useState } from 'react';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  technologies: string[];
  applyLink: string;
}

interface AddJobFormProps {
  onAddJob: (job: Omit<Job, 'id'>) => void;
  onClose: () => void;
  darkMode: boolean;
}

const AddJobForm: React.FC<AddJobFormProps> = ({ onAddJob, onClose, darkMode }) => {
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [technologies, setTechnologies] = useState('');
  const [applyLink, setApplyLink] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !company || !technologies) {
        // Basic validation
        alert('Please fill in at least Title, Company, and Technologies.');
        return;
    }
    const newJob = {
      title,
      company,
      location,
      description,
      technologies: technologies.split(',').map(tech => tech.trim()),
      applyLink,
    };
    onAddJob(newJob);
    onClose(); // Close the form after submission
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className={`modal-content ${darkMode ? 'dark-mode' : ''}`} onClick={(e) => e.stopPropagation()}>
        <h2 style={{ 
          textAlign: 'center', 
          color: darkMode ? '#f1f5f9' : '#1e293b',
          marginBottom: '24px' 
        }}>
          Add New Job Posting
        </h2>
        <form onSubmit={handleSubmit} className="job-form">
          <input
            type="text"
            placeholder="Job Title (e.g., Senior Java Developer)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Company (e.g., Google)"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Location (e.g., Remote, Pune)"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <textarea
            placeholder="Job Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <input
            type="text"
            placeholder="Technologies (comma-separated, e.g., Java, Spring Boot)"
            value={technologies}
            onChange={(e) => setTechnologies(e.target.value)}
            required
          />
          <input
            type="url"
            placeholder="Application Link"
            value={applyLink}
            onChange={(e) => setApplyLink(e.target.value)}
          />
          <div className="form-actions">
            <button type="button" onClick={onClose} className="button secondary">Cancel</button>
            <button type="submit" className="button">Add Job</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddJobForm; 