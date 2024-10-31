import sgMail from '@sendgrid/mail';
import { NextResponse } from 'next/server';

// Initialize SendGrid with your API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

// Use the provided template ID
const SENDGRID_TEMPLATE_ID = 'd-445f8304be58409996e4ae789cf87130';

export async function POST(req: Request) {
  try {
    const { to, subject, templateData } = await req.json();

    console.log('Received email request:', { to, subject, templateData });

    if (!to || !subject || !templateData) {
      const missingFields = [];
      if (!to) missingFields.push('to');
      if (!subject) missingFields.push('subject');
      if (!templateData) missingFields.push('templateData');
      
      console.error('Missing required fields:', missingFields);
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    if (!process.env.SENDGRID_VERIFIED_SENDER) {
      console.error('Missing required environment variable: SENDGRID_VERIFIED_SENDER');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const msg = {
      to,
      from: process.env.SENDGRID_VERIFIED_SENDER,
      subject,
      templateId: SENDGRID_TEMPLATE_ID,
      dynamicTemplateData: templateData,
    };

    try {
      console.log('Attempting to send email via SendGrid');
      const result = await sgMail.send(msg);
      console.log('SendGrid response:', result);
      return NextResponse.json({ message: 'Email sent successfully' });
    } catch (error: any) {
      console.error('SendGrid API error:', error);
      if (error.response) {
        console.error('SendGrid error response:', error.response.body);
      }
      return NextResponse.json(
        { error: 'Failed to send email', details: error.message },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Unexpected error in email API route:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred', details: error.message },
      { status: 500 }
    );
  }
}
