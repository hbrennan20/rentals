/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';

import { Box, Typography, Grid2, IconButton, Chip } from '@mui/material';
import {
  LinkedIn as LinkedInIcon,
  GitHub as GitHubIcon
} from '@mui/icons-material';
import Link from 'next/link';

const UserProfileComponent = () => {
  return (
    <Box
      sx={{
        bgcolor: 'background.default',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        p: 4
      }}
    ></Box>
  );
};

export default UserProfileComponent;
