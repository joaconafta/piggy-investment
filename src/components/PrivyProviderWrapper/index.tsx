'use client';

import { PrivyProvider } from "@privy-io/react-auth";
import { baseSepolia } from "viem/chains";

export default function PrivyProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PrivyProvider
        appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ""}
        config={{
            loginMethods: ['email', 'wallet'],
            appearance: {
                theme: 'light',
                accentColor: '#676FFF',
                logo: '../../../public/piggy.png'
            },
            embeddedWallets: {
                createOnLogin: 'all-users',
                noPromptOnSignature: true
            },
        }}
         
    >
        {children}
    </PrivyProvider>
  );
}