'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  AppBar,
  Toolbar,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import Link from 'next/link';
import SignOut from '../Navbar/SignOut';

interface HeaderProps {
  isSessionAvailable: boolean;
}

export default function Header({ isSessionAvailable }: HeaderProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar
      position="static"
      sx={{
        width: '100%',
        left: isSessionAvailable ? '50px' : 0,
        backgroundColor: '#1b3135',
        boxShadow: 'none'
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', paddingLeft: '10px' }}>
        <a href="/" style={{ textDecoration: 'none' }}>
          <Typography
            variant="h2"
            sx={{
              color: 'white',
              fontWeight: 'bold',
              padding: '8px 16px',
              borderRadius: '4px',
              textAlign: 'left'
            }}
          >
            Property
          </Typography>
        </a>
      </Toolbar>
    </AppBar>
  );
}
