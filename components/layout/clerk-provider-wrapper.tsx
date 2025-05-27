"use client";

import * as React from 'react';
import { ClerkProvider } from '@clerk/nextjs';
import { useTheme } from 'next-themes';

export function ClerkProviderWrapper({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme();

  const clerkVariables = React.useMemo(() => {
    const isDarkMode = resolvedTheme === 'dark';
    return {
      // Clerk's own variable names, mapped to your theme's HSL values
      colorPrimary: isDarkMode ? 'hsl(0 0% 98%)' : 'hsl(0 0% 9%)',
      colorText: isDarkMode ? 'hsl(0 0% 98%)' : 'hsl(0 0% 3.9%)',
      colorTextSecondary: isDarkMode ? 'hsl(0 0% 63.9%)' : 'hsl(0 0% 45.1%)',
      colorTextOnPrimaryBackground: isDarkMode ? 'hsl(0 0% 9%)' : 'hsl(0 0% 98%)',
      colorBackground: isDarkMode ? 'hsl(0 0% 3.9%)' : 'hsl(0 0% 100%)',
      colorInputBackground: isDarkMode ? 'hsl(0 0% 14.9%)' : 'hsl(0 0% 100%)',
      colorInputText: isDarkMode ? 'hsl(0 0% 98%)' : 'hsl(0 0% 3.9%)',
      colorBorder: isDarkMode ? 'hsl(0 0% 14.9%)' : 'hsl(0 0% 89.8%)',
      colorDanger: isDarkMode ? 'hsl(0 72.2% 50.6%)' : 'hsl(0 84.2% 60.2%)',
      colorTextDanger: isDarkMode ? 'hsl(0 0% 98%)' : 'hsl(0 0% 98%)',
      colorSuccess: isDarkMode ? 'hsl(142.1 70.6% 45.3%)' : 'hsl(142.1 76.2% 36.3%)',
      colorWarning: isDarkMode ? 'hsl(43 74% 66%)' : 'hsl(43 74% 49%)',
    };
  }, [resolvedTheme]);

  return (
    <ClerkProvider
      appearance={{
        variables: clerkVariables,
        elements: {
          // Core form elements - rely on variables for colors, classes for layout
          formButtonPrimary: 'bg-primary text-primary-foreground hover:bg-primary/90 rounded-md',
          formButtonReset: 'text-muted-foreground hover:text-foreground',
          formFieldLabel: 'text-sm font-medium',
          formFieldInput: 'bg-input border-border placeholder:text-muted-foreground focus:ring-1 focus:ring-ring focus:border-ring rounded-md',
          formFieldHintText: 'text-xs',
          formFieldErrorText: 'text-xs text-destructive-foreground',
          formHeaderTitle: 'text-2xl font-bold',
          formHeaderSubtitle: 'text-sm',
          
          // General layout and cards
          rootBox: 'bg-transparent',
          card: 'bg-card shadow-md rounded-lg',
          modalContent: 'bg-card rounded-lg shadow-xl',
          headerTitle: '', 
          headerSubtitle: '', 
          footer: 'bg-transparent pt-4',
          footerActionLink: 'text-primary hover:text-primary/90 text-sm',
          dividerText: 'text-sm',
          
          // User Profile specific - rely on variables for colors
          userProfilePage: 'bg-background',
          userProfileSection: 'bg-card shadow-md rounded-lg mb-6',
          userProfileSectionHeaderTitle: 'text-xl font-semibold',
          userProfileSectionHeaderText: 'text-sm',
          userProfileSectionItemTitle: 'font-medium',
          userProfileSectionItemDescription: 'text-sm',
          
          // Social buttons
          socialButtonsBlockButton: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 border-border rounded-md',

          // Select/Dropdowns
          selectOptionsContainer: 'bg-popover text-popover-foreground border-border rounded-md shadow-lg',
          selectOption: 'data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground text-popover-foreground px-2 py-1.5 text-sm cursor-default',

          // UserButton popover (global defaults)
          userButtonPopoverCard: 'rounded-lg bg-popover text-popover-foreground shadow-lg border border-border',
          userButtonPopoverActionButton: 'hover:bg-accent hover:text-accent-foreground rounded-sm text-sm',
          userButtonPopoverActionButtonText: 'text-popover-foreground',
          userButtonPopoverActionButtonIcon: 'text-popover-foreground',
          userButtonPopoverItem: 'hover:bg-accent hover:text-accent-foreground rounded-sm text-sm',
          userButtonPopoverItemText: 'text-popover-foreground',
          userButtonPopoverItemIcon: 'text-popover-foreground mr-2',
          userButtonPopoverFooterPageLink: 'text-sm text-popover-foreground hover:text-primary',

          // Other common elements
          identityPreviewText: 'text-sm',
          bodyText: 'text-sm',
          secondaryButton: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 border-border rounded-md',
          badge: 'bg-accent text-accent-foreground text-xs px-2 py-0.5 rounded-full',
          alert: 'bg-card border-border rounded-md p-4',
          alertText: '',
          dividerLine: 'bg-border',
        }
      }}
    >
      {children}
    </ClerkProvider>
  );
}