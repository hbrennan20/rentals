/* eslint-disable jsx-a11y/anchor-is-valid */
'use client';
import React from 'react';
import { usePathname } from 'next/navigation';
import { Box, Container, Grid, Typography, IconButton } from '@mui/material';
import { Facebook, Twitter, Instagram, Coffee } from '@mui/icons-material';
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#1c1c1c',
        color: '#fff',
        py: 6,
        borderTop: '1px solid #333',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom sx={{ color: '#fff' }}>
              Quick Links
            </Typography>
            <nav>

              <Link href="/contact" passHref>
                <Typography variant="body2" sx={{ mb: 1, display: 'block', color: '#fff' }}>
                  Contact
                </Typography>
              </Link>
            </nav>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom sx={{ color: '#fff' }}>
              Support Us
            </Typography>
            <Box>
              <IconButton color="inherit" aria-label="Buy Me a Coffee">
                <Coffee />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
        <Box mt={5}>
          <Typography variant="body2" sx={{ color: '#fff' }} align="center">
            {currentYear} Irish Property. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
