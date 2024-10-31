'use client';

import React, { FC, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  styled,
  Box,
  Typography,
  ListItemButton
} from '@mui/material';
import {
  Search,
  Restaurant,
  ShoppingCart,
  Kitchen,
  KeyboardArrowDown,
  ChevronRight,
  DoubleArrow
} from '@mui/icons-material';
// Remove or comment out the following line:
// import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import LockIcon from '@mui/icons-material/Lock';
import BuildIcon from '@mui/icons-material/Build';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SignOutButton from './SignOut';
import { styled as styledMaterial } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'; // Add this import
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'; // Add this import at the top of the file
import {
  Videocam as VideoIcon,
  YouTube as YouTubeIcon
} from '@mui/icons-material';
import { Facebook as FacebookIcon } from '@mui/icons-material'; // Add this import
import SettingsIcon from '@mui/icons-material/Settings'; // Add this import
import { WhatsApp as WhatsAppIcon } from '@mui/icons-material'; // Add this import at the top of the file
import AssessmentIcon from '@mui/icons-material/Assessment'; // Add this import
import InsightsIcon from '@mui/icons-material/Insights'; // Use a better icon for AI page
import HistoryIcon from '@mui/icons-material/History'; // Add this import
interface SideBarProps {
  session: boolean | null;
}

const StyledLink = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.text.primary
}));

const StyledBox = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  height: '100%'
});

const StyledSignOutButton = styled(SignOutButton)(({ theme }) => ({
  '& .MuiButton-root': {
    color: 'white',
    borderColor: 'white',
    '&:hover': {
      borderColor: 'white',
      backgroundColor: 'rgba(255, 255, 255, 0.08)'
    }
  },
  '& .MuiButton-startIcon': {
    color: 'white'
  }
}));

const BackgroundBox = styled(Box)(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  width: 50,
  height: '100%',
  backgroundColor: '#1b3135',
  zIndex: 1200
}));

const IconContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  position: 'fixed',
  top: 12,
  left: 3,
  zIndex: 1300
});

const SideBar: FC<SideBarProps> = ({ session }) => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const toggleDrawer = (isOpen: boolean) => () => {
    setOpen(isOpen);
  };

  const menuItems = [
    { text: 'Home', icon: <HomeIcon />, path: '/home' },
    { text: 'Sales Pipeline', icon: <AssessmentIcon />, path: '/pipeline' },
    { text: 'Historic Contracts', icon: <HistoryIcon />, path: '/historic_contracts' },
    { text: 'Charts', icon: <AssessmentIcon />, path: '/graphs' },

    { text: 'Settings', icon: <SettingsIcon />, path: '/settings' }    
  ];

  const closedSidebarContent = (
    <>
      <BackgroundBox />
      <IconContainer>
        <Tooltip title="Open Menu" placement="right">
          <IconButton
            color="inherit"
            onClick={toggleDrawer(true)}
            sx={{ my: 0.5, color: 'white' }}
          >
            <DoubleArrow />
          </IconButton>
        </Tooltip>
        {menuItems.map((item) => (
          <Tooltip key={item.text} title={item.text} placement="right">
            <IconButton
              color="inherit"
              onClick={() => router.push(item.path)}
              sx={{ my: 0.5, color: 'white' }}
            >
              {item.icon}
            </IconButton>
          </Tooltip>
        ))}
      </IconContainer>
    </>
  );

  const drawerContent = (
    <StyledBox
      sx={{ width: 200, bgcolor: '#1b3135', color: 'white' }}
      role="presentation"
      onClick={toggleDrawer(false)}
    >
      <Typography variant="h6" sx={{ p: 2, textAlign: 'center' }}>
        Menu
      </Typography>
      <List sx={{ pt: 2, flexGrow: 1 }}>
        {session ? (
          <>
            {menuItems.map((item) => (
              <StyledLink href={item.path} key={item.text}>
                <ListItem disablePadding>
                  <ListItemButton
                    sx={{ py: 1, color: 'white' }}
                    selected={pathname === item.path}
                  >
                    <ListItemIcon sx={{ color: 'white' }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText primary={item.text} sx={{ color: 'white' }} />
                  </ListItemButton>
                </ListItem>
              </StyledLink>
            ))}
            <StyledLink href="/profile">
              <ListItem sx={{ py: 1, color: 'white' }}>
                <ListItemIcon sx={{ color: 'white' }}>
                  <AccountCircleIcon />
                </ListItemIcon>
                <ListItemText primary="Profile" sx={{ color: 'white' }} />
              </ListItem>
            </StyledLink>
          </>
        ) : (
          <>
            <StyledLink href="/auth">
              <ListItem sx={{ py: 1, color: 'white' }}>
                <ListItemIcon sx={{ color: 'white' }}>
                  <LockIcon />
                </ListItemIcon>
                <ListItemText primary="Sign in" sx={{ color: 'white' }} />
              </ListItem>
            </StyledLink>
            <StyledLink href="/auth/signup">
              <ListItem sx={{ py: 1, color: 'white' }}>
                <ListItemIcon sx={{ color: 'white' }}>
                  <AccountCircleIcon />
                </ListItemIcon>
                <ListItemText primary="Sign up" sx={{ color: 'white' }} />
              </ListItem>
            </StyledLink>
          </>
        )}
      </List>
      {session && (
        <Box sx={{ mt: 'auto', p: 2 }}>
          <StyledSignOutButton />
        </Box>
      )}
    </StyledBox>
  );

  // Don't render anything if there's no session
  if (!session) {
    return null;
  }

  return (
    <>
      {!open && closedSidebarContent}
      <Drawer
        anchor="left"
        open={open}
        onClose={toggleDrawer(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: 200,
            height: '100%',
            boxSizing: 'border-box'
          }
        }}
        ModalProps={{
          keepMounted: true,
          disableScrollLock: true,
          BackdropProps: { style: { backgroundColor: 'transparent' } }
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
};

export default SideBar;
