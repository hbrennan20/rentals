import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Initialize Supabase client and handle session
  let supabaseResponse = NextResponse.next({
    request
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        }
      }
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // Allow access to home, signin, and all routes under /auth/
  const publicPaths = ['/', '/signin', '/auth'];
  if (!user && !publicPaths.includes(request.nextUrl.pathname) && !request.nextUrl.pathname.startsWith('/auth/')) {
    // Redirect all protected routes, including '/users', to the auth page
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * - api routes
     * - fonts
     * - sitemap.xml
     * - robots.txt
     * - manifest.json
     * - .well-known (for SSL certificates and other well-known paths)
     * - .css, .js, .json (static assets)
     * - .md, .mdx (markdown files)
     * - .pdf, .doc, .docx, .xls, .xlsx, .ppt, .pptx (document files)
     * - .zip, .tar, .gz, .rar (archive files)
     * - .mp3, .wav, .ogg, .flac (audio files)
     * - .mp4, .avi, .mov, .wmv, .flv (video files)
     * Feel free to modify this pattern to include more paths.
     */
    {
      source:
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|css|js|json|md|mdx|pdf|doc|docx|xls|xlsx|ppt|pptx|zip|tar|gz|rar|mp3|wav|ogg|flac|mp4|avi|mov|wmv|flv)$|api/.*|fonts/.*|sitemap.xml|robots.txt|manifest.json|manifest.webmanifest|\\.well-known/.*).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' }
      ]
    }
  ]
};
