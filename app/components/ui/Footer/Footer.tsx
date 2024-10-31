/* eslint-disable jsx-a11y/anchor-is-valid */
'use client';
import React from 'react';
import { usePathname } from 'next/navigation';
import { Box, Container, Grid, Typography, IconButton } from '@mui/material';
import { Facebook, Twitter, Instagram } from '@mui/icons-material';
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
              Rentals
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom sx={{ color: '#fff' }}>
              Quick Links
            </Typography>
            <nav>
              <Link href="/discover" passHref>
                <Typography variant="body2" sx={{ mb: 1, display: 'block', color: '#fff' }}>
                  Discover
                </Typography>
              </Link>
              <Link href="/connect" passHref>
                <Typography variant="body2" sx={{ mb: 1, display: 'block', color: '#fff' }}>
                  Connect
                </Typography>
              </Link>
              <Link href="/contact" passHref>
                <Typography variant="body2" sx={{ mb: 1, display: 'block', color: '#fff' }}>
                  Contact
                </Typography>
              </Link>
            </nav>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom sx={{ color: '#fff' }}>
              Follow Us
            </Typography>
            <Box>
              <IconButton color="inherit" aria-label="Facebook">
                <Facebook />
              </IconButton>
              <IconButton color="inherit" aria-label="Twitter">
                <Twitter />
              </IconButton>
              <IconButton color="inherit" aria-label="Instagram">
                <Instagram />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
        <Box mt={5}>
          <Typography variant="body2" color="text.secondary" align="center">
            © {currentYear} Chef's Corner. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
