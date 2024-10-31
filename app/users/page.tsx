'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Select,
  MenuItem,
  Pagination,
  Grid,
  Theme
} from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import {
  Search,
  Person,
  Group,
  KeyboardArrowDown
} from '@mui/icons-material';

const CustomerDashboard = () => {
  const customerData = [
    {
      name: 'Jane Cooper',
      company: 'Microsoft',
      phone: '(225) 555-0118',
      email: 'jane@microsoft.com',
      country: 'United States',
      status: 'Active'
    },
    {
      name: 'Floyd Miles',
      company: 'Yahoo',
      phone: '(205) 555-0100',
      email: 'floyd@yahoo.com',
      country: 'Kiribati',
      status: 'Inactive'
    },
    {
      name: 'Ronald Richards',
      company: 'Adobe',
      phone: '(302) 555-0107',
      email: 'ronald@adobe.com',
      country: 'Israel',
      status: 'Inactive'
    },
    {
      name: 'Marvin McKinney',
      company: 'Tesla',
      phone: '(252) 555-0126',
      email: 'marvin@tesla.com',
      country: 'Iran',
      status: 'Active'
    },
    {
      name: 'Jerome Bell',
      company: 'Google',
      phone: '(629) 555-0129',
      email: 'jerome@google.com',
      country: 'Réunion',
      status: 'Active'
    },
    {
      name: 'Kathryn Murphy',
      company: 'Microsoft',
      phone: '(406) 555-0120',
      email: 'kathryn@microsoft.com',
      country: 'Curaçao',
      status: 'Active'
    },
    {
      name: 'Jacob Jones',
      company: 'Yahoo',
      phone: '(208) 555-0112',
      email: 'jacob@yahoo.com',
      country: 'Brazil',
      status: 'Active'
    },
    {
      name: 'Kristin Watson',
      company: 'Facebook',
      phone: '(704) 555-0127',
      email: 'kristin@facebook.com',
      country: 'Åland Islands',
      status: 'Inactive'
    }
  ];

  // Modified useMediaQuery usage
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 600);
    };

    handleResize(); // Set initial value
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3 }, // Adjust padding for mobile
        bgcolor: 'grey.100',
        flexGrow: 1,
        overflow: 'auto',
        height: 'calc(100vh - 64px)'
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' }, // Stack vertically on mobile
          justifyContent: 'space-between',
          alignItems: { xs: 'stretch', sm: 'center' },
          mb: 3,
          gap: 2 // Add gap between elements
        }}
      >
        <Typography variant="h4" component="h1" fontWeight="bold" color="#1f1f1f">
          Hello Hugh 👋,
        </Typography>
        <TextField
          placeholder="Search"
          variant="outlined"
          size="small"
          fullWidth={isMobile} // Full width on mobile
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            )
          }}
        />
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          {/* Use Grid for responsive layout */}
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box
                sx={{ bgcolor: 'green.100', p: 1, borderRadius: '50%', mr: 2 }}
              >
                <Person sx={{ color: 'green.500' }} />
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Total Customers
                </Typography>
                <Typography variant="h6" fontWeight="bold">
                  423
                </Typography>
                <Typography variant="body2" color="green.500">
                  ↑ 16% this month
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box
                sx={{ bgcolor: 'purple.100', p: 1, borderRadius: '50%', mr: 2 }}
              >
                <Group sx={{ color: 'purple.500' }} />
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Members
                </Typography>
                <Typography variant="h6" fontWeight="bold">
                  293
                </Typography>
                <Typography variant="body2" color="success.main">
                  ↑ 12% this month
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Paper>
        <Box sx={{ p: 3 }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' }, // Stack vertically on mobile
              justifyContent: 'space-between',
              alignItems: { xs: 'stretch', sm: 'center' },
              mb: 2,
              gap: 2 // Add gap between elements
            }}
          >
            <Typography variant="h6" fontWeight="bold">
              All Customers
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'stretch', gap: 2 }}>
              <Typography variant="body2" color="green.500" sx={{ mr: 2 }}>
                Active Members
              </Typography>
              <TextField
                placeholder="Search"
                variant="outlined"
                size="small"
                fullWidth={isMobile} // Full width on mobile
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  )
                }}
              />
              <Select
                value="newest"
                size="small"
                fullWidth={isMobile} // Full width on mobile
                IconComponent={KeyboardArrowDown}
              >
                <MenuItem value="newest">Newest</MenuItem>
              </Select>
            </Box>
          </Box>
          <TableContainer sx={{ overflowX: 'auto' }}> {/* Make table scrollable */}
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Customer Name</TableCell>
                  <TableCell>Company</TableCell>
                  <TableCell>Phone Number</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Country</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {customerData.map((customer, index) => (
                  <TableRow key={index}>
                    <TableCell>{customer.name}</TableCell>
                    <TableCell>{customer.company}</TableCell>
                    <TableCell>{customer.phone}</TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>{customer.country}</TableCell>
                    <TableCell>
                      <Chip
                        label={customer.status}
                        color={
                          customer.status === 'Active' ? 'success' : 'error'
                        }
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' }, // Stack vertically on mobile
            justifyContent: 'space-between',
            alignItems: 'center',
            p: 2,
            borderTop: 1,
            borderColor: 'divider',
            gap: 2 // Add gap between elements
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Showing data 1 to 8 of 256K entries
          </Typography>
          <Pagination count={40} shape="rounded" size={isMobile ? 'small' : 'medium'} />
        </Box>
      </Paper>
    </Box>
  );
};

export default CustomerDashboard;
