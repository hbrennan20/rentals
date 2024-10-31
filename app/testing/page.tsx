'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import YouTubeIcon from '@mui/icons-material/YouTube';

const YouTubeConnector = () => {
  const [authUrl, setAuthUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchAuthUrl = async () => {
      try {
        const response = await fetch('/api/youtube/auth');
        const data = await response.json();
        if (data.authUrl) {
          setAuthUrl(data.authUrl);
        }
      } catch (error) {
        console.error('Error fetching auth URL:', error);
      }
    };

    fetchAuthUrl();
  }, []);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh'
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        Connect to YouTube
      </Typography>
      {authUrl ? (
        <Button
          variant="contained"
          color="error"
          href={authUrl}
          startIcon={<YouTubeIcon />}
          sx={{ fontSize: '1.2rem', padding: '10px 20px' }}
        >
          Connect YouTube Account
        </Button>
      ) : (
        <Typography>Loading...</Typography>
      )}
    </Box>
  );
};

export default YouTubeConnector;
