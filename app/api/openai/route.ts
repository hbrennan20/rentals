import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
    try {
        const { prompt, url } = await request.json();
        
        if (!prompt) {
            return NextResponse.json(
                { error: 'Prompt is required' },
                { status: 400 }
            );
        }

        const truncatedPrompt = prompt.slice(0, 4000) + (prompt.length > 4000 ? '...' : '');

        const completion = await openai.chat.completions.create({
            messages: [{ role: "user", content: truncatedPrompt }],
            model: "gpt-3.5-turbo",
        });

        const output = completion.choices?.[0]?.message?.content || 'No response generated';
        
        return NextResponse.json({ output });
    } catch (error) {
        console.error('OpenAI API error:', error);
        return NextResponse.json(
            { error: 'Failed to generate response' },
            { status: 500 }
        );
    }
}
