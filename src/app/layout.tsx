import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'
import './globals.css'
import type { AppProps } from 'next/app';

const clerkFrontendApi = process.env.NEXT_PUBLIC_CLERK_FRONTEND_API;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <SignedOut>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ClerkProvider frontendApi={clerkFrontendApi as string}>
      <Component {...pageProps} />
    </ClerkProvider>
  );
}
