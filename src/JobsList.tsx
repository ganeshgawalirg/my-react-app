import React from 'react';
import { Card, CardContent, CardHeader, Avatar, Chip, Typography, Button, Box, Stack } from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LabelIcon from '@mui/icons-material/Label';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  technologies: string[];
  applyLink: string;
  logoUrl?: string;
}

interface JobsListProps {
  jobs: Job[];
  darkMode: boolean;
  onDeleteJob: (id: string) => void;
}

const JobsList: React.FC<JobsListProps> = ({ jobs, darkMode, onDeleteJob }) => {
  if (jobs.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 6 }}>
        <Typography variant="h5" sx={{ mb: 1 }}>No job postings added yet.</Typography>
        <Typography variant="body1">Click the "Add New Job" button to get started!</Typography>
      </Box>
    );
  }

  return (
    <Stack spacing={4} sx={{ mt: 4 }}>
      {jobs.map(job => (
        <Card
          key={job.id}
          sx={{
            maxWidth: 600,
            mx: 'auto',
            borderRadius: 4,
            boxShadow: 6,
            bgcolor: darkMode ? '#23272f' : '#fff',
            color: darkMode ? '#f1f5f9' : '#1e293b',
            p: 2,
          }}
        >
          <CardHeader
            avatar={
              job.logoUrl ? (
                <Avatar src={job.logoUrl} alt={job.company} sx={{ width: 56, height: 56 }} />
              ) : (
                <Avatar sx={{ width: 56, height: 56, bgcolor: darkMode ? '#6366f1' : '#8b5cf6', fontSize: 28 }}>
                  <WorkIcon />
                </Avatar>
              )
            }
            title={<Typography variant="h6">{job.title}</Typography>}
            subheader={<Typography variant="subtitle1">{job.company}</Typography>}
            sx={{ pb: 0 }}
          />
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <LocationOnIcon fontSize="small" sx={{ color: darkMode ? '#4ecdc4' : '#6366f1' }} />
              <Typography variant="body2">{job.location}</Typography>
            </Box>
            {job.description && (
              <Typography variant="body1" sx={{ mb: 2, color: darkMode ? '#cbd5e1' : '#334155' }}>{job.description}</Typography>
            )}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              {job.technologies.filter(tech => tech).map(tech => (
                <Chip
                  key={tech}
                  label={tech}
                  icon={<LabelIcon />}
                  sx={{ bgcolor: darkMode ? '#334155' : '#e0e7ef', color: darkMode ? '#f1f5f9' : '#1e293b', fontWeight: 600 }}
                />
              ))}
            </Box>
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              {job.applyLink && (
                <Button
                  variant="contained"
                  color="primary"
                  href={job.applyLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ borderRadius: 2, boxShadow: 2 }}
                >
                  Apply Now
                </Button>
              )}
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => onDeleteJob(job.id)}
                sx={{ borderRadius: 2 }}
              >
                Delete
              </Button>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
};

export default JobsList; 