import React from 'react';
import {
  Box,
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface FAQ {
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    question:
      'How does AI integration enhance the food influencer streaming experience?',
    answer:
      'AI integration enhances the streaming experience by personalizing content recommendations, automating recipe categorization, and providing real-time insights on viewer engagement and preferences.'
  },
  {
    question:
      'What benefits does real-time updating offer for live cooking streams?',
    answer:
      'Real-time updating ensures that viewers always have access to the most current information, such as ingredient substitutions, cooking times, and live Q&A sessions, leading to a more interactive and engaging experience.'
  },
  {
    question:
      'How can deep insights help food influencers grow their audience?',
    answer:
      'Deep insights analyze complex data patterns to reveal viewer preferences, optimal streaming times, and content trends, helping influencers tailor their content strategy and expand their reach.'
  },
  {
    question:
      'How does centralized access to recipes and cooking tips benefit followers?',
    answer:
      "Centralized access ensures that all followers have easy access to a comprehensive library of recipes, cooking techniques, and tips, improving their culinary skills and engagement with the influencer's content."
  },
  {
    question:
      'What features make it easy for followers to interact with food influencers?',
    answer:
      'Live chat, polls, virtual cooking classes, and scheduled Q&A sessions help streamline interaction between influencers and their followers, creating a more engaging and community-driven experience.'
  },
  {
    question: 'How does the platform benefit aspiring food influencers?',
    answer:
      'The platform provides comprehensive analytics tools, audience growth features, and monetization options to support aspiring food influencers in building and growing their online presence.'
  }
];

const FAQItem: React.FC<FAQ> = ({ question, answer }) => {
  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
          {question}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography variant="body1">{answer}</Typography>
      </AccordionDetails>
    </Accordion>
  );
};

const FAQs: React.FC = () => {
  return (
    <Box
      id="faqs"
      sx={{
        width: '100%',
        pt: [1, 2, 3, 6],
        pb: [4, 6, 8, 12],
        bgcolor: '#f4f6f7'
      }}
    >
      <Container maxWidth="xl">
        <Box
          sx={{
            textAlign: 'center',
            mb: 10,
            px: [2, 3, 4, 5]
          }}
        >
          <Typography
            variant="h2"
            sx={{
              fontWeight: 'bold',
              letterSpacing: '0.05em',
              color: 'text.primary'
            }}
          >
            Frequently Asked Questions
          </Typography>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 'bold',
              maxWidth: 800,
              mx: 'auto',
              letterSpacing: '0.02em',
              color: 'text.secondary'
            }}
          >
            Get Answers to Common Queries
          </Typography>
        </Box>
        <Stack spacing={4} sx={{ px: [2, 3, 4, 5] }}>
          {faqs.map((faq, index) => (
            <FAQItem key={index} {...faq} />
          ))}
        </Stack>
      </Container>
    </Box>
  );
};

export default FAQs;
