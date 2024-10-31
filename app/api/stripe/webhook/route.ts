import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { headers } from 'next/headers';
import { createServerSupabaseClient as createClient } from '@/lib/server/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20'
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const body = await req.text();
  const sig = headers().get('stripe-signature') as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err: any) {
    console.error('Error verifying webhook signature:', err.message);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session;
      await handleSuccessfulPayment(session);
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}

async function handleSuccessfulPayment(session: Stripe.Checkout.Session) {
  const supabase = createClient();

  // Retrieve the user's email from the client_reference_id
  const userEmail = session.client_reference_id;

  if (!userEmail) {
    console.error('No user email found in session');
    return;
  }

  // Update the user's record
  const { data, error } = await supabase
    .from('users') // Assuming your table is named 'users'
    .update({
      is_subscriber: true,
      subscription_start_date: new Date().toISOString(),
      last_payment_date: new Date().toISOString()
      // You might want to add more fields like subscription_type, etc.
    })
    .eq('email', userEmail);

  if (error) {
    console.error('Error updating user record:', error);
  } else {
    console.log('User record updated successfully');
  }

  // You might want to send a confirmation email to the user here
}
