'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Switch,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const SettingsPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [emailFrequency, setEmailFrequency] = useState('daily');
  const [dietaryPreference, setDietaryPreference] = useState('');
  const [sendEmailFrom, setSendEmailFrom] = useState('');

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log('Saving settings:', {
      username,
      email,
      darkMode,
      notifications,
      emailFrequency,
      dietaryPreference
    });
  };

  return (
    <Box sx={{ maxWidth: 800, margin: 'auto', padding: 4 }}>
      <Typography
        variant="h3"
        component="h1"
        gutterBottom
        sx={{ textAlign: 'center', mb: 4 }}
      >
        Settings
      </Typography>
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h5">General Settings</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TextField
            fullWidth
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
          />
          <TextField
            select
            fullWidth
            label="Email Frequency"
            value={emailFrequency}
            onChange={(e) => setEmailFrequency(e.target.value)}
            margin="normal"
            SelectProps={{
              native: true
            }}
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </TextField>
          <TextField
            fullWidth
            label="Send Email From"
            value={sendEmailFrom}
            onChange={(e) => setSendEmailFrom(e.target.value)}
            margin="normal"
          />
        </AccordionDetails>
      </Accordion>
      <Box sx={{ my: 2 }} /> {/* Add gap here */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          size="large"
        >
          Save Settings
        </Button>
      </Box>
    </Box>
  );
};

export default SettingsPage;
