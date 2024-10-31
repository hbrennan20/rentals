import { NextResponse } from 'next/server';
import { createServerSupabaseClient as createClient } from '@/lib/server/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');

  if (code) {
    const supabase = createClient();

    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}/home`);
    }
  }

  // If there's an error or no code, redirect to the "/auth" route with an error message
  return NextResponse.redirect(`${origin}/auth?error=${encodeURIComponent('Authentication failed')}`);
}
