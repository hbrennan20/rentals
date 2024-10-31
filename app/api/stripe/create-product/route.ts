import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Ensure STRIPE_SECRET_KEY is properly set in your environment variables
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20' // Update to the latest supported API version
});

// Add some error logging
console.log(
  'Stripe initialized with key:',
  process.env.STRIPE_SECRET_KEY?.slice(0, 5) + '...'
);

export async function POST(req: Request) {
  try {
    const { productName, price } = await req.json();

    // Validate input
    if (!productName || typeof price !== 'number' || isNaN(price)) {
      return NextResponse.json(
        { error: 'Invalid input: Product name and valid price are required' },
        { status: 400 }
      );
    }

    // Create a product
    const product = await stripe.products.create({
      name: productName
    });

    // Create a price for the product (price should already be in cents from frontend)
    const stripePrice = await stripe.prices.create({
      product: product.id,
      unit_amount: price,
      currency: 'usd'
    });

    // Create a payment link
    const paymentLink = await stripe.paymentLinks.create({
      line_items: [{ price: stripePrice.id, quantity: 1 }]
    });

    return NextResponse.json({ paymentLink: paymentLink.url });
  } catch (error) {
    console.error('Stripe error:', error);
    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode || 500 }
      );
    }
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
