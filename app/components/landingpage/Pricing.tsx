import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Divider
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import Link from 'next/link';

interface PricingPlan {
  title: string;
  price: string;
  description: string;
  features: string[];
  buttonText: string;
  buttonLink: string;
  highlighted?: boolean;
}

const pricingPlans: PricingPlan[] = [
  {
    title: 'Basic',
    price: '$9.99',
    description: 'Perfect for small businesses',
    features: ['Feature 1', 'Feature 2', 'Feature 3'],
    buttonText: 'Get Started',
    buttonLink: 'https://buy.stripe.com/test_cN200Z9BS1A5dUI144'
  },
  {
    title: 'Premium',
    price: '$19.99',
    description: 'Ideal for growing companies',
    features: ['All Basic features', 'Feature 4', 'Feature 5', 'Feature 6'],
    buttonText: 'Upgrade to Premium',
    buttonLink: 'https://buy.stripe.com/test_14kdRP3duceJg2QaEF',
    highlighted: true
  },
  {
    title: 'Enterprise',
    price: '$49.99',
    description: 'For large-scale operations',
    features: [
      'All Pro features',
      'Feature 7',
      'Feature 8',
      'Feature 9',
      'Feature 10'
    ],
    buttonText: 'Contact Sales',
    buttonLink: '/contact'
  }
];

const PricingCard: React.FC<PricingPlan> = ({
  title,
  price,
  description,
  features,
  buttonText,
  buttonLink,
  highlighted = false
}) => {
  return (
    <Paper
      sx={{
        p: 5,
        textAlign: 'center',
        borderRadius: '12px',
        height: '100%',
        minHeight: 500,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: highlighted ? '#1b3135' : 'background.paper', // Updated color for highlighted
        color: highlighted ? 'primary.contrastText' : 'text.primary'
      }}
    >
      <Box>
        <Typography variant="h5" component="h3" fontWeight="bold" gutterBottom>
          {title}
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Typography variant="h4" component="span" fontWeight="bold">
            {price}
          </Typography>
          <Typography variant="subtitle1" component="span">
            /month
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ mt: 2 }}>
          {description}
        </Typography>
        <Divider sx={{ my: 3 }} />
        <List>
          {features.map((feature, index) => (
            <ListItem key={index} disableGutters>
              <ListItemIcon sx={{ minWidth: 'auto', mr: 1 }}>
                <CheckIcon color={highlighted ? 'secondary' : 'primary'} />
              </ListItemIcon>
              <ListItemText
                primary={feature}
                primaryTypographyProps={{ variant: 'body2' }}
              />
            </ListItem>
          ))}
        </List>
      </Box>
      <Link href={buttonLink} passHref legacyBehavior>
        <Button
          variant={highlighted ? 'contained' : 'outlined'}
          color={highlighted ? 'secondary' : 'primary'}
          fullWidth
          sx={{ mt: 3 }}
          component="a"
          target={buttonLink.startsWith('http') ? '_blank' : undefined}
          rel={
            buttonLink.startsWith('http') ? 'noopener noreferrer' : undefined
          }
        >
          {buttonText}
        </Button>
      </Link>
    </Paper>
  );
};

const Pricing: React.FC = () => {
  return (
    <Box
      sx={{
        width: '100%',
        pt: [1, 2, 3, 6],
        pb: [4, 6, 8, 12],
        px: [2, 3, 4, 5],
        backgroundColor: '#f4f6f7'
      }}
    >
      <Container maxWidth="xl">
        <Box sx={{ textAlign: 'center', mb: 10 }}>
          <Typography
            variant="h2"
            color="#1b3135"
            sx={{
              fontWeight: 'bold',
              fontFamily: 'Inter, sans-serif',
              letterSpacing: '0.1em'
            }}
          >
            Our Pricing Plans
          </Typography>
          <Typography
            variant="h5"
            sx={{
              maxWidth: 800,
              mx: 'auto',
              mt: 2,
              fontFamily: 'Inter, sans-serif',
              letterSpacing: '0.05em'
            }}
          >
            Choose the perfect plan for your needs
          </Typography>
        </Box>
        <Grid container spacing={4}>
          {pricingPlans.map((plan, index) => (
            <Grid item key={index} xs={12} md={4}>
              <PricingCard {...plan} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Pricing;
