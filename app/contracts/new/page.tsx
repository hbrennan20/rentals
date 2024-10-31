'use client'

import { useState, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { Box, Typography, Container, Paper, Button, CircularProgress, Stack, Accordion, AccordionSummary, AccordionDetails, TextField } from '@mui/material'
import { styled } from '@mui/material/styles'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import DescriptionIcon from '@mui/icons-material/Description'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

// Add styled components
const StyledDropzone = styled(Box)(({ theme }) => ({
  border: `2px dashed ${theme.palette.primary.main}`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(4),
  backgroundColor: theme.palette.grey[50],
  cursor: 'pointer',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    backgroundColor: theme.palette.grey[100],
    borderColor: theme.palette.primary.dark,
  },
}))

export default function NewContractPage() {
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [analysis, setAnalysis] = useState<string>('')
  const [rawText, setRawText] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>('')

  const handleDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    setPdfFile(file)
  }

  const handleAnalyze = async () => {
    if (!pdfFile) return

    setIsLoading(true)
    setError('')
    try {
      const formData = new FormData()
      formData.append('file', pdfFile)

      const textResponse = await fetch('/api/extract-pdf', {
        method: 'POST',
        body: formData,
      })

      if (!textResponse.ok) {
        const errorData = await textResponse.json()
        throw new Error(errorData.error || `Error: ${textResponse.status}`)
      }

      const { text } = await textResponse.json()
      setRawText(text)

      const analysisResponse = await fetch('/api/analyze-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      })

      if (!analysisResponse.ok) {
        const errorData = await analysisResponse.json()
        throw new Error(errorData.error || `Error: ${analysisResponse.status}`)
      }

      const { analysis } = await analysisResponse.json()
      setAnalysis(analysis)
    } catch (error) {
      console.error('Error processing document:', error)
      setError((error as Error).message)
      setAnalysis('')
      setRawText('')
    } finally {
      setIsLoading(false)
    }
  }

  // Log the selected file for debugging
  useEffect(() => {
    if (pdfFile) {
      console.log('Selected file:', pdfFile.name)
    }
  }, [pdfFile])

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxSize: 5000000, // 5MB limit
  })

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Stack spacing={4}>
          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom
            sx={{ 
              fontWeight: 'bold',
              color: 'primary.main',
              textAlign: 'left'
            }}
          >
            Contract Analysis
          </Typography>

          <StyledDropzone {...getRootProps()}>
            <input {...getInputProps()} />
            <Stack spacing={2} alignItems="center">
              <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main' }} />
              <Typography variant="h6" color="textSecondary" align="center">
                Drag and drop your files here
              </Typography>
              <Typography variant="body2" color="textSecondary" align="center">
                or click to select files
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Supported formats: PDF, Images, Word documents (Max size: 5MB)
              </Typography>
            </Stack>
          </StyledDropzone>

          {pdfFile && (
            <Paper 
              variant="outlined" 
              sx={{ p: 2, backgroundColor: 'grey.50' }}
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <DescriptionIcon color="primary" />
                <Typography variant="body1" sx={{ flex: 1 }}>
                  {pdfFile.name}
                </Typography>
                <Button
                  onClick={handleAnalyze}
                  disabled={isLoading}
                  variant="contained"
                  color="primary"
                  sx={{ minWidth: 120 }}
                >
                  {isLoading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    'Analyze'
                  )}
                </Button>
              </Stack>
            </Paper>
          )}

          {analysis && (
            <>
              <Paper 
                variant="outlined" 
                sx={{ 
                  p: 3,
                  backgroundColor: 'grey.50',
                  borderRadius: 2 
                }}
              >
                <Typography 
                  variant="h6" 
                  gutterBottom
                  sx={{ color: 'primary.main', fontWeight: 'medium' }}
                >
                  Analysis Results
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    whiteSpace: 'pre-wrap',
                    lineHeight: 1.7
                  }}
                >
                  {analysis}
                </Typography>
              </Paper>

              <Paper 
                variant="outlined" 
                sx={{ 
                  p: 3,
                  mt: 3,
                  backgroundColor: 'grey.50',
                  borderRadius: 2 
                }}
              >
                <Typography 
                  variant="h6" 
                  gutterBottom
                  sx={{ color: 'primary.main', fontWeight: 'medium' }}
                >
                  Document Text
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    whiteSpace: 'pre-wrap',
                    lineHeight: 1.7
                  }}
                >
                  {rawText}
                </Typography>
              </Paper>
            </>
          )}

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Manual Details</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Paper variant="outlined" sx={{ p: 2, backgroundColor: 'grey.50', borderRadius: 2 }}>
                <Typography variant="body1">
                  Please provide the necessary details for manual entry.
                </Typography>
                <Stack spacing={2} sx={{ mt: 2 }}>
                  <TextField label="Name" variant="outlined" fullWidth />
                  <TextField label="Date" type="date" variant="outlined" fullWidth InputLabelProps={{ shrink: true }} />
                  <TextField label="Value" variant="outlined" fullWidth />
                  <Button variant="contained" color="primary">Submit</Button>
                </Stack>
              </Paper>
            </AccordionDetails>
          </Accordion>

          <Button
            onClick={() => window.history.back()}
            variant="outlined"
            color="primary"
            sx={{ minWidth: 120 }}
          >
            <ArrowBackIcon sx={{ mr: 1 }} />
            Back
          </Button>
        </Stack>
      </Paper>
    </Container>
  )
}
