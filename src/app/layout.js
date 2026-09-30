import { JetBrains_Mono, Manrope, Sora } from 'next/font/google';
import './globals.css';

import { PageReadyProvider } from '@/context/PageReadyContext';
import SmoothScroll from '@/components/layout/SmoothScroll';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import LoadingScreen from '@/components/layout/LoadingScreen';
import CustomCursor from '@/components/effects/CustomCursor';
import ScrollProgress from '@/components/effects/ScrollProgress';
import NoiseOverlay from '@/components/effects/NoiseOverlay';
import SectionIndicator from '@/components/effects/SectionIndicator';
import { themeScript } from '@/hooks/useTheme';
import { profile } from '@/data/profile';

const display = Sora({
  subsets: ['latin'],
  display: 'swap',
  weight: ['600', '700', '800'],
  variable: '--font-display',
});

const sans = Manrope({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500'],
  variable: '--font-mono',
});

/**
 * The canonical site origin. Set `NEXT_PUBLIC_SITE_URL` in `.env.local` once
 * the real domain exists; until then no `metadataBase` is emitted, so nothing
 * is advertised that the owner does not actually own.
 */
function resolveMetadataBase() {
  const raw = process.env.NEXT_PUBLIC_SITE_URL;
  if (!raw) return undefined;
  try {
    return new URL(raw);
  } catch {
    return undefined;
  }
}

export const metadata = {
  metadataBase: resolveMetadataBase(),
  title: {
    default: profile.seo.title,
    template: `%s — ${profile.fullName}`,
  },
  description: profile.seo.description,
  keywords: profile.seo.keywords,
  authors: [{ name: profile.fullName }],
  creator: profile.fullName,
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    title: profile.seo.title,
    description: profile.seo.description,
    siteName: profile.fullName,
  },
  twitter: {
    card: 'summary_large_image',
    title: profile.seo.title,
    description: profile.seo.description,
  },
  robots: { index: true, follow: true },
};

export const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#05070b' },
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
  ],
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-theme="dark"
      className={`${display.variable} ${sans.variable} ${mono.variable}`}
    >
      <head>
        {/* Applies the stored/system theme before first paint to avoid a flash. */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <noscript>
          <style>{`[data-loader]{display:none !important}`}</style>
        </noscript>
      </head>
      <body className="bg-bg text-text antialiased">
        <PageReadyProvider>
          <a
            href="#home"
            className="sr-only rounded-full bg-accent px-4 py-2 text-sm font-medium text-on-accent focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200]"
          >
            Skip to content
          </a>

          <SmoothScroll />
          <NoiseOverlay />
          <CustomCursor />
          <ScrollProgress />
          <Navbar />
          <SectionIndicator />

          <main id="content" className="relative z-10">
            {children}
          </main>

          <Footer />
          <LoadingScreen />
        </PageReadyProvider>
      </body>
    </html>
  );
}
