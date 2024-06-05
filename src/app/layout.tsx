import React from 'react';
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs';
import { Toaster } from 'react-hot-toast';
import './globals.css';

const Layout: React.FC = ({ children }) => {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <Toaster />
          <div className="header">
            <SignedOut>
              <div className="signin-button">
                <SignInButton />
              </div>
            </SignedOut>
            <SignedIn>
              <div className="user-button">
                <UserButton />
              </div>
            </SignedIn>
          </div>
          <div className="content">{children}</div>
        </body>
      </html>
    </ClerkProvider>
  );
};

export default Layout;
