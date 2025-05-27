"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useClerk } from "@clerk/nextjs";

export default function SignOutPage() {
  const router = useRouter();
  const { signOut } = useClerk();

  useEffect(() => {
    // Automatically sign out when this page loads
    const performSignOut = async () => {
      await signOut(() => router.push("/"));
    };
    
    performSignOut();
  }, [signOut, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 space-y-8 bg-card rounded-lg shadow-lg">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Signing Out...</h1>
          <p className="mt-2 text-muted-foreground">
            You are being signed out of your account.
          </p>
        </div>
      </div>
    </div>
  );
}
