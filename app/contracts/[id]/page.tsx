'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Typography, Box, Paper, Grid, Chip, Avatar, List, ListItem, ListItemText, Divider, IconButton, Breadcrumbs } from '@mui/material';
import { Public, Favorite, AttachMoney, People, Event, ArrowBack } from '@mui/icons-material';
import Link from 'next/link';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Mock data (replace with actual data fetching in a real application)
const contractData = {
  name: "Global Green Initiative",
  logo: "/path/to/logo.png",
  mission: "Promoting environmental sustainability and combating climate change worldwide.",
  founded: 2005,
  location: "New York, NY",
  website: "www.globalgreeninitiative.org",
  causes: ["Environment", "Climate Change", "Sustainability"],
  financials: {
    annualBudget: "$5,000,000",
    programExpenses: "75%",
    fundraisingExpenses: "15%",
    administrativeExpenses: "10%",
  },
  impact: {
    treesPlanted: 1000000,
    carbonOffset: "500,000 tons",
    communitiesServed: 250,
  },
  upcomingEvents: [
    { name: "Earth Day Cleanup", date: "2024-04-22" },
    { name: "Green Tech Symposium", date: "2024-06-15" },
  ],
  contactInfo: {
    email: "info@globalgreeninitiative.org",
    phone: "+1 (555) 123-4567",
  },
};

const contractPage = () => {
  const params = useParams();
  const router = useRouter();
  const contractId = params.id;

  // In a real application, you would fetch the contract data here using the contractId

  // Dummy financial data for the last 3 years
  const financialData = [
    { year: '2021', 'Annual Budget': 4000000, 'Program Expenses': 3000000, 'Fundraising Expenses': 600000, 'Administrative Expenses': 400000 },
    { year: '2022', 'Annual Budget': 4500000, 'Program Expenses': 3375000, 'Fundraising Expenses': 675000, 'Administrative Expenses': 450000 },
    { year: '2023', 'Annual Budget': 5000000, 'Program Expenses': 3750000, 'Fundraising Expenses': 750000, 'Administrative Expenses': 500000 },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
        <IconButton onClick={() => router.back()} sx={{ mr: 2 }}>
          <ArrowBack />
        </IconButton>
        <Breadcrumbs aria-label="breadcrumb">
          <Link href="/" passHref style={{ textDecoration: 'none' }}>
            <Typography color="text.primary">Home</Typography>
          </Link>
          <Link href="/contracts" passHref style={{ textDecoration: 'none' }}>
            <Typography color="text.primary">Contracts</Typography>
          </Link>
          <Typography color="text.secondary">{contractData.name}</Typography>
        </Breadcrumbs>
      </Box>
      <Paper sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {/* Header */}
          <Grid item xs={12} display="flex" alignItems="center" gap={2}>
            <Avatar src={contractData.logo} sx={{ width: 80, height: 80 }} />
            <Box>
              <Typography variant="h4">{contractData.name}</Typography>
              <Typography variant="subtitle1" color="text.secondary">{contractData.location}</Typography>
            </Box>
          </Grid>

          {/* Mission */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>Mission</Typography>
            <Typography variant="body1">{contractData.mission}</Typography>
          </Grid>

          {/* Quick Facts */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>Quick Facts</Typography>
            <List>
              <ListItem>
                <ListItemText primary="Founded" secondary={contractData.founded} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Website" secondary={contractData.website} />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Causes" 
                  secondary={
                    <Box sx={{ mt: 1 }}>
                      {contractData.causes.map((cause, index) => (
                        <Chip key={index} label={cause} size="small" sx={{ mr: 1, mb: 1 }} />
                      ))}
                    </Box>
                  }
                />
              </ListItem>
            </List>
          </Grid>

          {/* Financials */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>Financials</Typography>
            <List>
              <ListItem>
                <ListItemText primary="Annual Budget" secondary={contractData.financials.annualBudget} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Program Expenses" secondary={contractData.financials.programExpenses} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Fundraising Expenses" secondary={contractData.financials.fundraisingExpenses} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Administrative Expenses" secondary={contractData.financials.administrativeExpenses} />
              </ListItem>
            </List>
          </Grid>

          {/* Government Contracts */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>Government Contracts</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <AttachMoney sx={{ fontSize: 40, color: 'primary.main' }} />
                  <Typography variant="h4">$25M</Typography>
                  <Typography variant="body2">Total Contract Value</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Event sx={{ fontSize: 40, color: 'primary.main' }} />
                  <Typography variant="h4">15</Typography>
                  <Typography variant="body2">Active Contracts</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <People sx={{ fontSize: 40, color: 'primary.main' }} />
                  <Typography variant="h4">5</Typography>
                  <Typography variant="body2">Government Agencies Served</Typography>
                </Paper>
              </Grid>
            </Grid>
          </Grid>

          {/* Upcoming Events */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>Upcoming Events</Typography>
            <List>
              {contractData.upcomingEvents.map((event, index) => (
                <React.Fragment key={index}>
                  <ListItem>
                    <ListItemText 
                      primary={event.name}
                      secondary={new Date(event.date).toLocaleDateString()}
                    />
                  </ListItem>
                  {index < contractData.upcomingEvents.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Grid>

          {/* Contact Information */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>Contact Information</Typography>
            <List>
              <ListItem>
                <ListItemText primary="Email" secondary={contractData.contactInfo.email} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Phone" secondary={contractData.contactInfo.phone} />
              </ListItem>
            </List>
          </Grid>
        </Grid>
      </Paper>
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h5" gutterBottom>Financial Overview</Typography>
        <Box sx={{ height: 400, mt: 2 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={financialData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis 
                tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
                label={{ value: 'Millions ($)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                formatter={(value) => [`$${(Number(value) / 1000000).toFixed(2)}M`, 'Amount']}
                labelFormatter={(label) => `Year: ${label}`}
              />
              <Legend />
              <Bar dataKey="Annual Budget" fill="rgba(0, 0, 0, 0.8)" />
              <Bar dataKey="Program Expenses" fill="rgba(64, 64, 64, 0.8)" />
              <Bar dataKey="Fundraising Expenses" fill="rgba(128, 128, 128, 0.8)" />
              <Bar dataKey="Administrative Expenses" fill="rgba(192, 192, 192, 0.8)" />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Paper>
    </Box>
  );
};

export default contractPage;
