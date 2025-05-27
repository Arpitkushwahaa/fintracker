"use client";

import { SignUp } from "@clerk/nextjs";
import { CreditCard } from "lucide-react";

export default function SignUpPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-background to-muted py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <CreditCard className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">Create your FinTrack account</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Start managing your finances today
          </p>
        </div>
        <SignUp 
          appearance={{
            elements: {
              formButtonPrimary: 'bg-primary text-primary-foreground hover:bg-primary/90',
              card: 'bg-card',
              headerTitle: 'text-foreground',
              headerSubtitle: 'text-muted-foreground',
              formFieldLabel: 'text-foreground',
              footerActionLink: 'text-primary hover:text-primary/90'
            }
          }}
          redirectUrl="/dashboard"
        />
      </div>
    </div>
  );
}
