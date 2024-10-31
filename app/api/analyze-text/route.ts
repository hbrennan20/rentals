import { NextResponse } from 'next/server'
import { Configuration, OpenAIApi } from 'openai'; // Import OpenAI SDK

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY, // Ensure your OpenAI API key is set in environment variables
});
const openai = new OpenAIApi(configuration);

export async function POST(request: Request) {
  try {
    const { text } = await request.json()

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Invalid or missing text' },
        { status: 400 }
      )
    }

    // Call OpenAI API for analysis
    const gptResponse = await openai.createCompletion({
      model: "text-davinci-003", // Specify the model
      prompt: `Analyze the following text: ${text}`,
      max_tokens: 150, // Adjust as needed
    });

    const analysis = gptResponse.data.choices[0].text.trim(); // Get the analysis from the response

    return NextResponse.json({ analysis })
  } catch (error) {
    console.error('Error analyzing text:', error)
    return NextResponse.json(
      { error: 'Failed to analyze text' },
      { status: 500 }
    )
  }
} 