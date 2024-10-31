import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { url } = await request.json();
        
        const response = await fetch(url);
        const content = await response.text();

        // Extract description from div with data-testid="description"
        const descriptionMatch = content.match(/<div data-testid="description"[^>]*>(.*?)<\/div>/s);
        const description = descriptionMatch 
            ? descriptionMatch[1]
                .replace(/&amp;/g, '&')
                .replace(/&nbsp;/g, ' ')
                .trim()
            : '';

        return NextResponse.json({ description });
    } catch (error) {
        console.error('Error fetching URL:', error);
        return NextResponse.json({ error: 'Failed to fetch URL content' }, { status: 500 });
    }
} 