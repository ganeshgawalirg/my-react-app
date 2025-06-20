import React, { useState } from 'react';
import {
  Grid, Card, CardContent, CardHeader, TextField, Typography, Button, Chip, Avatar, Stepper, Step, StepLabel, Box
} from '@mui/material';

const steps = ['Job Details', 'Technologies', 'Review & Submit'];

interface Job {
  title: string;
  company: string;
  location: string;
  technologies: string[];
  logoUrl?: string;
}

interface AddJobFormProps {
  onAddJob: (job: Job) => void;
  onClose?: () => void;
  darkMode?: boolean;
}

const AddJobForm: React.FC<AddJobFormProps> = ({ onAddJob, onClose, darkMode }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('Remote');
  const [technologies, setTechnologies] = useState<string[]>([]);
  const [techInput, setTechInput] = useState('');
  const [logoUrl, setLogoUrl] = useState<string | undefined>(undefined);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [success, setSuccess] = useState(false);

  const handleNext = () => setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
  const handleBack = () => setActiveStep((prev) => Math.max(prev - 1, 0));

  const handleAddTech = () => {
    if (techInput.trim() && !technologies.includes(techInput.trim())) {
      setTechnologies([...technologies, techInput.trim()]);
      setTechInput('');
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogoFile(e.target.files[0]);
      setLogoUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddJob({ title, company, location, technologies, logoUrl });
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      if (onClose) onClose();
    }, 1200);
  };

  return (
    <Box sx={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      background: darkMode ? 'rgba(30,41,59,0.85)' : 'rgba(0,0,0,0.35)',
      zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(2px)'
    }}>
      <Card sx={{
        minWidth: 350, maxWidth: 900, width: '95vw', borderRadius: 3, boxShadow: 6,
        bgcolor: darkMode ? '#23272f' : '#fff', color: darkMode ? '#f1f5f9' : '#1e293b', p: 2, maxHeight: '90vh', overflowY: 'auto'
      }}>
        <CardHeader
          title="Add New Job Posting"
          action={onClose && (
            <Button onClick={onClose} sx={{ minWidth: 0, color: darkMode ? '#fff' : '#1e293b' }}>×</Button>
          )}
          sx={{ textAlign: 'center', pb: 0 }}
        />
        <Stepper activeStep={activeStep} alternativeLabel sx={{ my: 2 }}>
          {steps.map(label => (
            <Step key={label}><StepLabel>{label}</StepLabel></Step>
          ))}
        </Stepper>
        <Grid container spacing={3}>
          {/* Form Section */}
          <Grid item xs={12} md={7}>
            <form onSubmit={handleSubmit} autoComplete="off">
              {activeStep === 0 && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <TextField
                    label="Job Title *"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    required
                    fullWidth
                    variant="outlined"
                    autoFocus
                  />
                  <TextField
                    label="Company *"
                    value={company}
                    onChange={e => setCompany(e.target.value)}
                    required
                    fullWidth
                    variant="outlined"
                  />
                  <TextField
                    label="Location"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    fullWidth
                    variant="outlined"
                  />
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>Company Logo (optional, max 2MB)</Typography>
                    <Button variant="outlined" component="label">
                      Upload Logo
                      <input type="file" hidden accept="image/*" onChange={handleLogoChange} />
                    </Button>
                    {logoUrl && <Avatar src={logoUrl} sx={{ width: 40, height: 40, ml: 2, display: 'inline-flex', verticalAlign: 'middle' }} />}
                  </Box>
                  <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                    <Button variant="contained" onClick={handleNext} disabled={!title || !company}>Next</Button>
                  </Box>
                </Box>
              )}
              {activeStep === 1 && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>Technologies (press Enter to add)</Typography>
                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <TextField
                      label="Add Technology"
                      value={techInput}
                      onChange={e => setTechInput(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddTech(); } }}
                      variant="outlined"
                      size="small"
                    />
                    <Button onClick={handleAddTech} variant="contained">Add</Button>
                  </Box>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    {technologies.map(tech => (
                      <Chip key={tech} label={tech} onDelete={() => setTechnologies(technologies.filter(t => t !== tech))} />
                    ))}
                  </Box>
                  <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                    <Button variant="outlined" onClick={handleBack}>Back</Button>
                    <Button variant="contained" onClick={handleNext} disabled={technologies.length === 0}>Next</Button>
                  </Box>
                </Box>
              )}
              {activeStep === 2 && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Typography variant="h6">Review & Submit</Typography>
                  <Button type="submit" variant="contained" color="success" disabled={!title || !company || technologies.length === 0}>Submit</Button>
                  {success && <Typography color="success.main" sx={{ mt: 2 }}>Job added successfully!</Typography>}
                  <Button variant="outlined" onClick={() => { setActiveStep(0); setTitle(''); setCompany(''); setLocation('Remote'); setTechnologies([]); setLogoUrl(undefined); setLogoFile(null); }}>Reset</Button>
                </Box>
              )}
            </form>
          </Grid>
          {/* Preview Section */}
          <Grid item xs={12} md={5}>
            <Card variant="outlined" sx={{ bgcolor: darkMode ? '#1e293b' : '#f8f9fa', color: darkMode ? '#1e293b' : '#1e293b' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  {logoUrl && <Avatar src={logoUrl} sx={{ width: 56, height: 56 }} />}
                  <Box>
                    <Typography variant="h6">{title || 'Job Title'}</Typography>
                    <Typography variant="subtitle2">{company || 'Company'} • {location || 'Location'}</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                  {technologies.map(tech => (
                    <Chip key={tech} label={tech} />
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Card>
    </Box>
  );
};

export default AddJobForm; 