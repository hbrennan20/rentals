import React from 'react';
import { Stack, Typography } from '@mui/material';
import {
  VideocamRounded as VideocamRoundedIcon,
  ChatRounded as ChatRoundedIcon,
  MonetizationOnRounded as MonetizationOnRoundedIcon,
  CardGiftcardRounded as CardGiftcardRoundedIcon
} from '@mui/icons-material';

const items = [
  {
    icon: <VideocamRoundedIcon sx={{ color: 'text.secondary' }} />,
    title: 'Live Streaming',
    description:
      'Broadcast live to your followers in real-time. Engage with your audience through high-quality video streams and interactive features.'
  },
  {
    icon: <ChatRoundedIcon sx={{ color: 'text.secondary' }} />,
    title: 'Real-time Chat',
    description:
      'Connect with your viewers through a live chat during your streams. Answer questions, respond to comments, and build a stronger community.'
  },
  {
    icon: <MonetizationOnRoundedIcon sx={{ color: 'text.secondary' }} />,
    title: 'Monetization Tools',
    description:
      'Earn revenue from your streams with built-in monetization features. Receive virtual gifts, super chats, and sponsorships directly from your audience.'
  },
  {
    icon: <CardGiftcardRoundedIcon sx={{ color: 'text.secondary' }} />,
    title: 'Free Trial',
    description:
      'Try our premium streaming features for free. Experience the full power of our platform and take your influencer career to the next level.'
  }
];

export default function Content() {
  return (
    <Stack
      sx={{
        flexDirection: 'column',
        alignSelf: 'center',
        gap: 4,
        maxWidth: 450
      }}
    >
      {items.map((item, index) => (
        <Stack
          key={index}
          direction="row"
          sx={{
            gap: 2
          }}
        >
          {item.icon}
          <div>
            <Typography
              gutterBottom
              sx={{
                fontWeight: 'medium'
              }}
            >
              {item.title}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary'
              }}
            >
              {item.description}
            </Typography>
          </div>
        </Stack>
      ))}
    </Stack>
  );
}
