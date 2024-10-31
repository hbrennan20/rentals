'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  Paper,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  AttachMoney,
  Group,
  TrendingUp,
  CalendarToday,
  Link as LinkIcon
} from '@mui/icons-material';
import Link from 'next/link'; // Add this import
import { createClient } from '@/lib/client/client';

const HomePage = () => {
  const router = useRouter();
  const [paymentLinks, setPaymentLinks] = useState<Array<{ id: number; url: string; createdAt: string }>>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const supabase = createClient();

  // Mock data for metrics (replace with actual data fetching logic)
  const metrics = {
    totalUsers: 25,
    activeUsers: 12,
    nextPayout: '2024-10-15',
    payoutAmount: 15000
  };

  // Function to fetch payment links (replace with actual API call)
  const fetchPaymentLinks = async () => {
    if (!userId) return;

    try {
      const { data: chefData, error: chefError } = await supabase
        .from('chefs')
        .select('payment_links')
        .eq('user_id', userId)
        .single();

      if (chefError) {
        console.error('Error fetching chef data:', chefError);
        return;
      }

      console.log('Fetched chef data:', chefData);

      if (chefData && chefData.payment_links) {
        // Check if payment_links is an array
        const links = Array.isArray(chefData.payment_links) 
          ? chefData.payment_links.map((url, index) => ({
              id: index + 1,
              url,
              createdAt: new Date().toISOString()
            }))
          : [];
        console.log('Processed payment links:', links);
        setPaymentLinks(links);
      } else {
        console.log('No payment links found in chef data');
        setPaymentLinks([]); // Ensure empty array is set
      }
    } catch (error) {
      console.error('Error fetching payment links:', error);
      setPaymentLinks([]); // Ensure empty array is set on error
    }
  };

  useEffect(() => {
    const fetchUserId = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Error fetching user data:', error);
      } else if (user) {
        setUserId(user.id);
      }
    };

    fetchUserId();
  }, [supabase.auth]);

  useEffect(() => {
    if (userId) {
      fetchPaymentLinks();
    }
  }, [userId]);

  // Add this console.log for debugging
  console.log('Current paymentLinks state:', paymentLinks);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#f4f6f7'  // Changed from '#979fd1'
      }}
    >
      <Container
        maxWidth={false}
        sx={{ flexGrow: 1, py: 6, px: { xs: 4, sm: 6, md: 8 } }}
      >
        <Paper
          elevation={3}
          sx={{ p: 4, mb: 6, borderRadius: 2, bgcolor: '#ffffff' }}
        >
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            fontWeight="bold"
            align="center"
          >
            Your Dashboard
          </Typography>
          <Typography
            variant="h5"
            paragraph
            color="text.secondary"
            align="center"
          >
            Track revenue, expenses, and key metrics with ease. Get started with
            your personalized dashboard today!
          </Typography>
        </Paper>

        {/* Metrics Cards */}
        <Grid container spacing={4} sx={{ mb: 6 }}>
          {[
            {
              icon: <Group fontSize="large" />,
              label: 'Total Contracts',
              value: metrics.totalUsers,
              link: '/users'
            },
            {
              icon: <TrendingUp fontSize="large" />,
              label: 'Active Contracts',
              value: metrics.activeUsers,
              link: '/users'
            },
            {
              icon: <CalendarToday fontSize="large" />,
              label: 'Next Payout Date',
              value: metrics.nextPayout,
              link: '/finance_dashboard'
            },
            {
              icon: <AttachMoney fontSize="large" />,
              label: 'Next Payout Amount',
              value: `$${metrics.payoutAmount}`,
              link: '/finance_dashboard'
            }
          ].map((item, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                elevation={3}
                sx={{
                  height: '100%',
                  borderRadius: 2,
                  transition: 'transform 0.3s',
                  '&:hover': { transform: 'scale(1.05)' },
                  cursor: item.link ? 'pointer' : 'default'
                }}
                onClick={() => item.link && router.push(item.link)}
              >
                <CardContent
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%'
                  }}
                >
                  {item.icon}
                  <Typography
                    color="text.secondary"
                    gutterBottom
                    sx={{ mt: 2 }}
                  >
                    {item.label}
                  </Typography>
                  <Typography variant="h4" component="div" fontWeight="bold">
                    {item.value}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>


      </Container>
      

      {/* New Section for Call to Action */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2, bgcolor: '#ffffff', textAlign: 'center' }}>
          <Button variant="contained" color="primary" href="/contracts" sx={{ fontSize: '1.5rem', padding: '1rem 2rem' }}>
            View Government Contracts
          </Button>
        </Paper>
      </Container>

      {/* Footer Section */}
      <Box sx={{ bgcolor: '#f4f6f7', py: 3, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} Your Company Name. All rights reserved.
        </Typography>
      </Box>
    </Box>
    
  );
};

export default HomePage;
