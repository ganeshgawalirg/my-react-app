import React from 'react';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  technologies: string[];
  applyLink: string;
}

interface JobsListProps {
  jobs: Job[];
  darkMode: boolean;
  onDeleteJob: (id: string) => void;
}

const JobsList: React.FC<JobsListProps> = ({ jobs, darkMode, onDeleteJob }) => {
  if (jobs.length === 0) {
    return (
      <div className="empty-state" style={{ textAlign: 'center', padding: '40px' }}>
        <h3>No job postings added yet.</h3>
        <p>Click the "Add New Job" button to get started!</p>
      </div>
    );
  }

  return (
    <div className="jobs-list">
      {jobs.map(job => (
        <div key={job.id} className={`job-card ${darkMode ? 'dark-mode' : ''}`}>
          <h3>{job.title}</h3>
          <h4 className="company-name">{job.company}</h4>
          {job.location && <p className="location">📍 {job.location}</p>}
          {job.description && <p className="description">{job.description}</p>}
          <div className="technologies">
            {job.technologies.filter(tech => tech).map(tech => <span key={tech} className="tech-tag">{tech}</span>)}
          </div>
          <div className="job-actions">
            {job.applyLink && <a href={job.applyLink} target="_blank" rel="noopener noreferrer" className="button">Apply Now</a>}
            <button onClick={() => onDeleteJob(job.id)} className="button secondary">Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default JobsList; 