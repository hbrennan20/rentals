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

// Add this new import for fetching data
import { fetchStripeCustomers } from '../api/stripe/fetch-customers/route'; // Adjust the import path as needed

const CustomerDashboard = () => {
  // Remove the customerData array
  // const customerData = [ ... ];

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

  // New state for Stripe purchases
  const [stripePurchases, setStripePurchases] = useState([]);

  // Fetch Stripe purchases
  useEffect(() => {
    const getStripePurchases = async () => {
      try {
        const purchases = await fetchStripePurchases();
        setStripePurchases(purchases);
      } catch (error) {
        console.error('Error fetching Stripe purchases:', error);
      }
    };

    getStripePurchases();
  }, []);

  // New state for Stripe customers
  const [stripeCustomers, setStripeCustomers] = useState([]);
  const [error, setError] = useState(null);

  // Fetch Stripe customers
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        console.log('Fetching customers...');
        const response = await fetch('/api/stripe/fetch-customers');
        console.log('Response status:', response.status);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.error}`);
        }
        
        const customers = await response.json();
        console.log('Fetched customers:', customers);
        setStripeCustomers(customers);
      } catch (error) {
        console.error('Error fetching Stripe customers:', error);
        setError(error.message);
      }
    };

    fetchCustomers();
  }, []);

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3 },
        bgcolor: 'grey.100',
        flexGrow: 1,
        overflow: 'auto',
        height: 'calc(100vh - 64px)'
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'stretch', sm: 'center' },
          mb: 3,
          gap: 2
        }}
      >
        <Typography variant="h4" component="h1" fontWeight="bold">
          Testing Actual Users here based on stripe customers,
        </Typography>
        <TextField
          placeholder="Search"
          variant="outlined"
          size="small"
          fullWidth={isMobile}
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
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between',
              alignItems: { xs: 'stretch', sm: 'center' },
              mb: 2,
              gap: 2
            }}
          >
            <Typography variant="h6" fontWeight="bold">
              Stripe Customers
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'stretch', gap: 2 }}>
              <Typography variant="body2" color="green.500" sx={{ mr: 2 }}>
                Active Members
              </Typography>
              <TextField
                placeholder="Search"
                variant="outlined"
                size="small"
                fullWidth={isMobile}
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
                fullWidth={isMobile}
                IconComponent={KeyboardArrowDown}
              >
                <MenuItem value="newest">Newest</MenuItem>
              </Select>
            </Box>
          </Box>
          <TableContainer sx={{ overflowX: 'auto' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Customer Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Created Date</TableCell>
                  <TableCell>Subscription Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {stripeCustomers.length > 0 ? (
                  stripeCustomers.map((customer, index) => (
                    <TableRow key={index}>
                      <TableCell>{customer.customerName}</TableCell>
                      <TableCell>{customer.email}</TableCell>
                      <TableCell>{new Date(customer.createdDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Chip
                          label={customer.subscriptionStatus}
                          color={customer.subscriptionStatus === 'active' ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      No customers found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            p: 2,
            borderTop: 1,
            borderColor: 'divider',
            gap: 2
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Showing data 1 to 8 of 256K entries
          </Typography>
          <Pagination count={40} shape="rounded" size={isMobile ? 'small' : 'medium'} />
        </Box>
      </Paper>
      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          Error: {error}
        </Typography>
      )}
    </Box>
  );
};

export default CustomerDashboard;
