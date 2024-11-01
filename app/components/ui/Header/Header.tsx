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
        {isSessionAvailable ? (
          <Box>
            <IconButton
              sx={{ padding: 0 }}
              onClick={handleMenuOpen}
              aria-controls="profile-menu"
              aria-haspopup="true"
            >
              <Avatar alt="User Profile"  />
            </IconButton>
            <Menu
              id="profile-menu"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right'
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right'
              }}
            >
              <MenuItem
                component={Link}
                href="/profile"
                onClick={handleMenuClose}
              >
                <AccountCircleIcon sx={{ mr: 1 }} />
                Profile
              </MenuItem>
              <MenuItem
                component={Link}
                href="/settings"
                onClick={handleMenuClose}
              >
                <SettingsIcon sx={{ mr: 1 }} />
                Settings
              </MenuItem>
              <MenuItem onClick={handleMenuClose}>
                <SignOut />
              </MenuItem>
            </Menu>
          </Box>
        ) : (
          <>
            <Link href="/auth" passHref>
              <Button
                variant="contained"
                sx={{ backgroundColor: 'white', color: '#1b3135' }}
              >
                Sign In
              </Button>
            </Link>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}
