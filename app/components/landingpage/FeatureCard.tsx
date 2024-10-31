import React from 'react';
import {
  Box,
  Container,
  Grid2,
  Typography,
  Paper,
  Divider
} from '@mui/material';
import Link from 'next/link';
type Feature = {
  title: string;
  description: string | React.ReactElement;
  Icon: React.ReactElement; // Changed from string to React.ReactElement
};
import { CheckCircle, Assessment, Lock } from '@mui/icons-material';

const features = [
  {
    title: 'Compliance Management',
    description:
      'Streamline your compliance process with our intuitive tools and ensure regulatory adherence.',
    Icon: <CheckCircle fontSize="large" />
  },
  {
    title: 'Real-time Reporting',
    description:
      'Generate detailed reports instantly, providing transparency and insights into your project performance.',
    Icon: <Assessment fontSize="large" />
  },
  {
    title: 'Secure Data Storage',
    description: (
      <>
        <strong>Protect your sensitive data with our enterprise-grade security measures.</strong>
      </>
    ),
    Icon: <Lock fontSize="large" />
  }
];

const FeatureCard: React.FC<Feature> = ({ title, description, Icon }) => {
  return (
    <Paper
      sx={{
        p: 5,
        textAlign: 'center',
        borderRadius: '12px',
        borderColor: '#2A2A2A',
        height: '100%',
        minHeight: 350,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        width: '100%',
        fontFamily: 'Arial, sans-serif' // Added font family to match Banner
      }}
    >
      <Box sx={{ p: 3, fontSize: 50, opacity: 0.9 }}>{Icon}</Box>
      <Typography
        variant="h6"
        color="primary"
        gutterBottom
        sx={{
          fontWeight: 'bold'
        }}
      >
        {title}
      </Typography>
      <Divider variant="middle" />
      <Typography
        variant="body2"
        component="div"
        sx={{
          color: 'text.secondary',
          mt: 3
        }}
      >
        {description}
      </Typography>
    </Paper>
  );
};

export default function Component() {
  return (
    <Box
      id="models"
      sx={{
        width: '100%',
        pt: [1, 2, 3, 6],
        pb: [4, 6, 8, 12],
        backgroundColor: '#f4f6f7'
      }}
    >
      <Container maxWidth="xl">
        <Box
          sx={{
            textAlign: 'center',
            mb: 10
          }}
        >
          <Typography
            variant="h1"
            sx={{
              fontWeight: 'bold',
              fontFamily: 'Inter, sans-serif',
              letterSpacing: '0.1em',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              backgroundGradient: 'linear(to r, #ffcc00, grey.400)' // Updated gradient
            }}
          >
            What we do?
          </Typography>
        </Box>
        <Grid2 container spacing={10}>
          {features.map((feature, index) => (
            <Grid2
              key={index}
              style={{ display: 'flex' }}
              size={{
                xs: 12,
                sm: 6,
                md: 4
              }}
            >
              <FeatureCard
                title={feature.title}
                description={feature.description}
                Icon={feature.Icon}
              />
            </Grid2>
          ))}
        </Grid2>
      </Container>
    </Box>
  );
}
