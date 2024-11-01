// RootLayout.tsx
import React, { type ReactNode } from 'react';
import { Inter } from 'next/font/google';
import ThemeRegistry from '@/theme/ThemeRegistry';
import RootErrorBoundary from '@/app/components/errorBoundary/ErrorBoundaryPage';
import Header from '@/app/components/ui/Header/Header';
import Box from '@mui/material/Box';

import '@fontsource/inter';

const inter = Inter({ subsets: ['latin'] });

// Add this style
const globalStyles = `
  html {
    scroll-behavior: smooth;
  }
`;

export const metadata = {
  metadataBase: new URL('http://localhost:3000/'),
  title: "Property",
  description:
    'Property'
};

export default async function RootLayout({
  children
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <style>{globalStyles}</style>
      </head>
      <body className={inter.className}>
        <ThemeRegistry>
          <RootErrorBoundary>
            <Box sx={{ display: 'flex', minHeight: '100vh' }}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  flexGrow: 1,
                  width: '100%',
                  marginLeft: 0
                }}
              >
                <Header />
                <Box
                  component="main"
                  sx={{
                    flexGrow: 1,
                    overflow: 'auto',
                    padding: '10px 50px 10px 50px', // Updated left and right padding
                    backgroundColor: '#f4f6f7'
                  }}
                >
                  {children} {/* Remove the condition here */}
                </Box>
              </Box>
            </Box>
          </RootErrorBoundary>
        </ThemeRegistry>
      </body>
    </html>
  );
}

