import { writeFile } from 'fs/promises';
import { NextResponse } from 'next/server';
import path from 'path';

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const filePath = path.join(process.cwd(), 'app/data/pipeline-data.json');
        
        await writeFile(filePath, JSON.stringify(data, null, 2));
        
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error updating pipeline data:', error);
        return NextResponse.json({ success: false, error: 'Failed to update pipeline data' }, { status: 500 });
    }
} 