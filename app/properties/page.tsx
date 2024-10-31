'use client';

import { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Card,
  CardContent,
  CircularProgress,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

export default function ContractsPage() {
    const [url, setUrl] = useState('');
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch('/api/openai', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    prompt: input,
                    url: url.trim()
                }),
            });
            const data = await response.json();
            setOutput(data.output);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom align="center">
                    AI Assistant
                </Typography>
                
                <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
                    <TextField
                        fullWidth
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="Enter URL here (optional)..."
                        variant="outlined"
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Enter your prompt here..."
                        variant="outlined"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSubmit(e);
                            }
                        }}
                        sx={{ mb: 2 }}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                        disabled={loading || !input.trim()}
                        fullWidth
                    >
                        {loading ? 'Processing...' : 'Submit'}
                    </Button>
                </Box>

                {output && (
                    <Card variant="outlined">
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Response:
                            </Typography>
                            <Typography variant="body1" component="div" sx={{ whiteSpace: 'pre-wrap' }}>
                                {output}
                            </Typography>
                        </CardContent>
                    </Card>
                )}
            </Paper>
        </Container>
    );
}
