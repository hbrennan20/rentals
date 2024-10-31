'use client';

import React, { useState } from 'react';
import { Box, Container, Typography, Slider, Paper } from '@mui/material';

const EarningsSlider: React.FC = () => {
  const [followers, setFollowers] = useState<number>(20); // Start at 20k

  const calculateEarnings = (followers: number): number => {
    return followers * 1000 * 1;
  };

  const formatFollowers = (value: number): string => {
    if (value >= 100) {
      return '1m+';
    }
    return `${value * 10}k`;
  };

  const formatCurrency = (value: number): string => {
    return value.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  return (
    <Box
      sx={{
        width: '100%',
        py: [8, 10, 12],
        backgroundColor: '#f0f7f4',
      }}
    >
      <Container maxWidth="md">
        <Paper elevation={3} sx={{ p: [4, 6], borderRadius: 4, backgroundColor: '#ffffff' }}>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 'bold',
              fontFamily: '"Poppins", sans-serif',
              fontSize: ['2rem', '2.5rem', '3rem'],
              textAlign: 'center',
              mb: 6,
              color: '#2c3e50',
            }}
          >
            Potential Earnings Calculator
          </Typography>
          
          {/* Moved slider section here */}
          <Typography
            variant="h6"
            sx={{ mb: 4, color: '#34495e', textAlign: 'center', fontFamily: '"Roboto", sans-serif' }}
          >
            How many followers do you have?
          </Typography>
          <Slider
            value={followers}
            onChange={(_, newValue) => setFollowers(newValue as number)}
            aria-labelledby="followers-slider"
            valueLabelDisplay="auto"
            valueLabelFormat={formatFollowers}
            step={1}
            marks
            min={2}
            max={100}
            sx={{
              width: '100%',
              maxWidth: 500,
              mx: 'auto', // This centers the slider
              display: 'block', // Ensures the slider takes full width of its container
              mb: 5,
              '& .MuiSlider-thumb': {
                backgroundColor: '#3498db',
                '&:hover, &.Mui-focusVisible': {
                  boxShadow: '0 0 0 8px rgba(52, 152, 219, 0.16)',
                },
              },
              '& .MuiSlider-track': {
                backgroundColor: '#3498db',
              },
              '& .MuiSlider-rail': {
                backgroundColor: '#bdc3c7',
              },
            }}
          />
          <Typography variant="body1" sx={{ mt: 3, mb: 5, textAlign: 'center', color: '#34495e' }}>
            Followers: <strong>{formatFollowers(followers)}</strong>
          </Typography>
          
          <Box sx={{ textAlign: 'center', backgroundColor: '#ecf0f1', p: 4, borderRadius: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#2c3e50', mb: 2 }}>
              Potential Monthly Earnings
            </Typography>
            <Typography
              variant="h3"
              sx={{ fontWeight: 'bold', color: '#27ae60', mb: 2 }}
            >
              {formatCurrency(calculateEarnings(followers))}
            </Typography>
            <Typography variant="body2" sx={{ color: '#7f8c8d' }}>
              If only 1% of your followers pay $10 per month
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default EarningsSlider;
