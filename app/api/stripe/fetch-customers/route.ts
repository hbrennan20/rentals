import Stripe from 'stripe';

// Initialize the Stripe client
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16', // Use the latest API version
});

export async function GET() {
  console.log('API route called');
  try {
    console.log('Stripe key:', process.env.STRIPE_SECRET_KEY?.substring(0, 5) + '...');
    
    const allCustomers = [];
    let hasMore = true;
    let startingAfter: string | undefined;

    while (hasMore) {
      console.log('Fetching customers, starting after:', startingAfter);
      const customers = await stripe.customers.list({
        limit: 100, // Adjust as needed
        expand: ['data.subscriptions'],
        starting_after: startingAfter,
      });

      console.log(`Fetched ${customers.data.length} customers`);

      allCustomers.push(...customers.data.map(customer => ({
        customerName: customer.name || 'N/A',
        email: customer.email || 'N/A',
        createdDate: new Date(customer.created * 1000).toISOString(),
        subscriptionStatus: customer.subscriptions?.data[0]?.status || 'No active subscription',
      })));

      hasMore = customers.has_more;
      startingAfter = customers.data[customers.data.length - 1]?.id;
    }

    console.log(`Total customers fetched: ${allCustomers.length}`);
    return new Response(JSON.stringify(allCustomers), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching Stripe customers:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch customers', details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
