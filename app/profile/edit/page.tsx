'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Container,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Instagram, YouTube, Twitter } from '@mui/icons-material';
import Flag from 'react-world-flags';
import Confetti from 'react-confetti';

const theme = createTheme();

const OnboardingFlow = () => {
  const [step, setStep] = useState(1);
  const [showConfetti, setShowConfetti] = useState(false);
  const [userData, setUserData] = useState({
    name: '',
    nickname: '',
    country: '',
    instagramLink: '',
    tiktokLink: '',
    youtubeLink: ''
  });
  const router = useRouter();

  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => {
        setShowConfetti(false);
        router.push('/home');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showConfetti, router]);

  const handleNextStep = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      setShowConfetti(true);
    }
  };

  const handleInputChange = (
    event: React.ChangeEvent<
      HTMLInputElement | { name?: string; value: unknown }
    >
  ) => {
    const { name, value } = event.target;
    setUserData({ ...userData, [name as string]: value });
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } }
  };

  // Add this list of countries
  const countries = [
    { code: 'US', name: 'United States' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'CA', name: 'Canada' },
    { code: 'AU', name: 'Australia' },
    { code: 'IE', name: 'Ireland' },
    { code: 'ES', name: 'Spain' },
    { code: 'NL', name: 'Netherlands' },
    { code: 'DE', name: 'Germany' },
    { code: 'FR', name: 'France' },
    { code: 'IT', name: 'Italy' },
    { code: 'JP', name: 'Japan' },
    { code: 'BR', name: 'Brazil' },
    { code: 'IN', name: 'India' }
  ];

  return (
    <ThemeProvider theme={theme}>
      {showConfetti && (
        <Confetti
          colors={['#000000', '#FFFFFF']}
          numberOfPieces={200}
          gravity={0.5}
          wind={0.05}
          recycle={false}
          initialVelocityY={20}
          height={window.innerHeight * 2}
        />
      )}
      <Container
        component="main"
        maxWidth="sm"
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <motion.div initial="hidden" animate="visible" variants={fadeIn}>
          <Card elevation={6} sx={{ padding: 4, width: '100%' }}>
            <CardContent>
              <Typography
                variant="h4"
                component="h1"
                gutterBottom
                align="center"
              >
                Welcome to Our Platform 🎉
              </Typography>

              <motion.div
                key={step}
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -50, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {step === 1 && (
                  <div>
                    <Typography
                      variant="h5"
                      component="h2"
                      gutterBottom
                      align="center"
                    >
                      Step 1: About Me
                    </Typography>
                    <TextField
                      fullWidth
                      label="Name"
                      name="name"
                      value={userData.name}
                      onChange={handleInputChange}
                      margin="normal"
                      InputProps={{
                        startAdornment: (
                          <span role="img" aria-label="person">
                            👤
                          </span>
                        )
                      }}
                    />
                    <TextField
                      fullWidth
                      label="Nickname"
                      name="nickname"
                      value={userData.nickname}
                      onChange={handleInputChange}
                      margin="normal"
                      InputProps={{
                        startAdornment: (
                          <span role="img" aria-label="star">
                            ⭐
                          </span>
                        )
                      }}
                    />
                    <FormControl fullWidth margin="normal">
                      <InputLabel id="country-label">Country</InputLabel>
                      <Select
                        labelId="country-label"
                        id="country"
                        name="country"
                        value={userData.country}
                        onChange={handleInputChange}
                        label="Country"
                      >
                        {countries.map((country) => (
                          <MenuItem key={country.code} value={country.code}>
                            <Flag
                              code={country.code}
                              height="16"
                              style={{ marginRight: '8px' }}
                            />
                            {country.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <TextField
                      fullWidth
                      label="Instagram Link"
                      name="instagramLink"
                      value={userData.instagramLink}
                      onChange={handleInputChange}
                      margin="normal"
                      InputProps={{
                        startAdornment: <Instagram />
                      }}
                    />
                    <TextField
                      fullWidth
                      label="TikTok Link"
                      name="tiktokLink"
                      value={userData.tiktokLink}
                      onChange={handleInputChange}
                      margin="normal"
                      InputProps={{
                        startAdornment: (
                          <span role="img" aria-label="tiktok">
                            🎵
                          </span>
                        )
                      }}
                    />
                    <TextField
                      fullWidth
                      label="YouTube Link"
                      name="youtubeLink"
                      value={userData.youtubeLink}
                      onChange={handleInputChange}
                      margin="normal"
                      InputProps={{
                        startAdornment: <YouTube />
                      }}
                    />
                  </div>
                )}

                {step === 2 && (
                  <div>
                    <Typography
                      variant="h5"
                      component="h2"
                      gutterBottom
                      align="center"
                    >
                      Step 2: Preferences 🔧
                    </Typography>
                    {/* Add form fields for user preferences */}
                  </div>
                )}

                {step === 3 && (
                  <div>
                    <Typography
                      variant="h5"
                      component="h2"
                      gutterBottom
                      align="center"
                    >
                      Step 3: Confirmation ✅
                    </Typography>
                    {/* Add summary and confirmation step */}
                  </div>
                )}
              </motion.div>

              <Button
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                onClick={handleNextStep}
                sx={{ mt: 3 }}
              >
                {step < 3 ? 'Next 👉' : 'Complete 🎊'}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </Container>
    </ThemeProvider>
  );
};

export default OnboardingFlow;
