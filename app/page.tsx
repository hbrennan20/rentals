import 'server-only';
import React from 'react';
import BannerComponent from './components/landingpage/Banner';
import Profile from './components/landingpage/Profile';
import Divider from '@mui/material/Divider';
import FeatureCard from './components/landingpage/FeatureCard';
import Pricing from './components/landingpage/Pricing';
import Testimonials from './components/landingpage/Testimonials';
import { getSession } from '@/lib/server/supabase';
import { redirectIfLoggedIn } from './auth/action';
import Footer from './components/ui/Footer/Footer';

export default async function RootPage() {
  await redirectIfLoggedIn();

  const session = await getSession();
  const isSessionAvailable = session !== null;
  const userEmail = session?.email;
  return (
    <>
      <div style={{ backgroundColor: '#f4f6f7', minHeight: '100vh' }}>
        <BannerComponent session={isSessionAvailable} userEmail={userEmail} />
        <FeatureCard />
        <Divider />
        <Divider />
        <Divider />
        <Profile />
        <Divider />
      </div>
      <Footer />
    </>
  );
}
