'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Typography, Box, Paper, Grid, Chip, Avatar, List, ListItem, ListItemText, Divider, IconButton, Breadcrumbs } from '@mui/material';
import { Public, Favorite, AttachMoney, People, Event, ArrowBack } from '@mui/icons-material';
import Link from 'next/link';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Updated mock data
const propertyData = {
  name: "Sunset Villa Apartments",
  images: ["/path/to/property-image.jpg"],
  description: "Luxury waterfront apartment complex with modern amenities and stunning views.",
  yearBuilt: 2015,
  location: "123 Ocean Drive, Miami, FL",
  website: "www.sunsetvillaapartments.com",
  amenities: ["Pool", "Fitness Center", "Covered Parking", "Pet Friendly"],
  financials: {
    monthlyRent: "$2,500",
    securityDeposit: "$2,500",
    maintenanceFee: "$100",
    utilityEstimate: "$150",
  },
  stats: {
    totalUnits: 150,
    occupancyRate: "95%",
    avgLeaseLength: "12 months",
  },
  availableUnits: [
    { name: "2BR Deluxe", date: "2024-05-01" },
    { name: "1BR Studio", date: "2024-04-15" },
  ],
  contactInfo: {
    email: "leasing@sunsetvilla.com",
    phone: "+1 (555) 123-4567",
  },
};

const PropertyPage = () => {
  const params = useParams();
  const router = useRouter();
  const propertyId = params.id;

  // Updated financial data for property performance
  const financialData = [
    { year: '2021', 'Rental Income': 4000000, 'Operating Expenses': 1500000, 'Maintenance Costs': 500000, 'Net Income': 2000000 },
    { year: '2022', 'Rental Income': 4500000, 'Operating Expenses': 1600000, 'Maintenance Costs': 600000, 'Net Income': 2300000 },
    { year: '2023', 'Rental Income': 5000000, 'Operating Expenses': 1700000, 'Maintenance Costs': 700000, 'Net Income': 2600000 },
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
          <Link href="/properties" passHref style={{ textDecoration: 'none' }}>
            <Typography color="text.primary">Properties</Typography>
          </Link>
          <Typography color="text.secondary">{propertyData.name}</Typography>
        </Breadcrumbs>
      </Box>
      <Paper sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {/* Header - updated */}
          <Grid item xs={12} display="flex" alignItems="center" gap={2}>
            <Avatar src={propertyData.images[0]} sx={{ width: 80, height: 80 }} />
            <Box>
              <Typography variant="h4">{propertyData.name}</Typography>
              <Typography variant="subtitle1" color="text.secondary">{propertyData.location}</Typography>
            </Box>
          </Grid>

          {/* Description - renamed from Mission */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>Property Description</Typography>
            <Typography variant="body1">{propertyData.description}</Typography>
          </Grid>

          {/* Quick Facts - updated */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>Quick Facts</Typography>
            <List>
              <ListItem>
                <ListItemText primary="Year Built" secondary={propertyData.yearBuilt} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Website" secondary={propertyData.website} />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Amenities" 
                  secondary={
                    <Box sx={{ mt: 1 }}>
                      {propertyData.amenities.map((amenity, index) => (
                        <Chip key={index} label={amenity} size="small" sx={{ mr: 1, mb: 1 }} />
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
                <ListItemText primary="Monthly Rent" secondary={propertyData.financials.monthlyRent} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Security Deposit" secondary={propertyData.financials.securityDeposit} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Maintenance Fee" secondary={propertyData.financials.maintenanceFee} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Utility Estimate" secondary={propertyData.financials.utilityEstimate} />
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
              {propertyData.availableUnits.map((unit, index) => (
                <React.Fragment key={index}>
                  <ListItem>
                    <ListItemText 
                      primary={unit.name}
                      secondary={new Date(unit.date).toLocaleDateString()}
                    />
                  </ListItem>
                  {index < propertyData.availableUnits.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Grid>

          {/* Contact Information */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>Contact Information</Typography>
            <List>
              <ListItem>
                <ListItemText primary="Email" secondary={propertyData.contactInfo.email} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Phone" secondary={propertyData.contactInfo.phone} />
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
              <Bar dataKey="Rental Income" fill="rgba(0, 0, 0, 0.8)" />
              <Bar dataKey="Operating Expenses" fill="rgba(64, 64, 64, 0.8)" />
              <Bar dataKey="Maintenance Costs" fill="rgba(128, 128, 128, 0.8)" />
              <Bar dataKey="Net Income" fill="rgba(192, 192, 192, 0.8)" />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Paper>
    </Box>
  );
};

export default PropertyPage;
