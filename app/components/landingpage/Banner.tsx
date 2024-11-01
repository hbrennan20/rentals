import React from 'react';
import { Box, Typography, Button, Grid, Avatar } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';

interface BannerComponentProps {
  session: boolean;
  userEmail?: string;
}

const BannerComponent: React.FC<BannerComponentProps> = ({ session, userEmail }) => {
  return (
    <Box sx={{ 
      fontFamily: 'Inter, sans-serif',
      backgroundColor: '#f4f6f7',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
    }}>
      <Box sx={{ padding: { xs: '2rem', sm: '3rem', md: '4rem 6rem' }, width: '100%' }}>
        <Grid container spacing={{ xs: 4, md: 8 }} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography
              variant="h1"
              sx={{ 
                fontWeight: 700,
                mb: 4,
                fontSize: { xs: '2.5rem', sm: '3rem', md: '4rem' },
                lineHeight: 1.2,
                color: '#000000',
              }}
            >
              Irish Property
            </Typography>
            <Typography
              variant="h5"
              sx={{ 
                color: '#000000',
                mb: 5,
                lineHeight: 1.6,
                fontFamily: '"Lato", sans-serif',
                fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
              }}
            >
              Irish Property
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, mb: 5 }}>
              <Link href="/auth/signup" passHref>
                <Button
                  variant="contained"
                  sx={{ 
                    backgroundColor: '#1b3135',
                    color: 'white',
                    mb: { xs: 2, sm: 0 },
                    mr: { sm: 3 },
                    py: 2,
                    px: 4,
                    fontSize: { xs: '1rem', md: '1.1rem' },
                    fontWeight: 600,
                    width: { xs: '100%', sm: 'auto' },
                    '&:hover': {
                      backgroundColor: '#5da57d',
                    },
                  }}
                >
                  Get Started
                </Button>
              </Link>
              <Button
                variant="outlined"
                sx={{ 
                  color: '#1b3135',
                  borderColor: '#1b3135',
                  py: 2,
                  px: 4,
                  fontSize: { xs: '1rem', md: '1.1rem' },
                  fontWeight: 600,
                  width: { xs: '100%', sm: 'auto' },
                  '&:hover': {
                    backgroundColor: 'rgba(118, 194, 153, 0.1)',
                  },
                }}
              >
                Learn More →
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box
              sx={{ 
                position: 'relative',
                height: { xs: '300px', sm: '400px', md: '600px' },
                width: '100%',
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: '0',
                  left: '0',
                  width: '100%',
                  height: '100%',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                }}
              >
                <Image
                  src="/images/new.png"
                  alt="landing"
                  layout="fill"
                  objectFit="cover"
                />
              </Box>
              <Avatar
                sx={{
                  position: 'absolute',
                  bottom: '10%',
                  left: '-5%',
                  width: { xs: 60, sm: 80, md: 100 },
                  height: { xs: 60, sm: 80, md: 100 },
                  border: '4px solid white',
                  boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default BannerComponent;
