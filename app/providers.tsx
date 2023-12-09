"use client";

import * as React from "react";

import {
  connectorsForWallets,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import { getDefaultWallets } from "@rainbow-me/rainbowkit";
import {
  argentWallet,
  coinbaseWallet,
  imTokenWallet,
  injectedWallet,
  ledgerWallet,
  metaMaskWallet,
  omniWallet,
  rainbowWallet,
  trustWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";

import "@rainbow-me/rainbowkit/styles.css";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";

import { ParticleNetwork } from "@particle-network/auth";
import { arbitrum, mainnet, optimism, polygon } from "wagmi/chains";

import { particleWallet } from "@particle-network/rainbowkit-ext";
const demoAppInfo = {
  appName: "Rainbowkit Demo",
};
const particle = new ParticleNetwork({
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID as string,
  clientKey: process.env.NEXT_PUBLIC_CLIENT_KEY as string,
  appId: process.env.NEXT_PUBLIC_APP_ID as string,
});

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet, polygon, optimism, arbitrum],
  [publicProvider()]
);

const particleWallets = [
  particleWallet({ chains, authType: "google" }),
  particleWallet({ chains, authType: "facebook" }),
  particleWallet({ chains, authType: "apple" }),
  particleWallet({ chains, authType: "jwt" }),
  particleWallet({ chains }),
];

const popularWallets = {
  groupName: "Popular",
  wallets: [
    ...particleWallets,
    injectedWallet({ chains }),
    rainbowWallet({
      chains,
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID as string,
    }),
    coinbaseWallet({ appName: "RainbowKit demo", chains }),
    metaMaskWallet({
      chains,
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID as string,
    }),
    walletConnectWallet({
      chains,
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID as string,
    }),
  ],
};

const connectors = connectorsForWallets([
  popularWallets,
  {
    groupName: "Other",
    wallets: [
      argentWallet({
        chains,
        projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID as string,
      }),
      trustWallet({
        chains,
        projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID as string,
      }),
      omniWallet({
        chains,
        projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID as string,
      }),
      imTokenWallet({
        chains,
        projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID as string,
      }),
      ledgerWallet({
        chains,
        projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID as string,
      }),
    ],
  },
]);
// const { connectors } = getDefaultWallets({
//   appName: "My RainbowKit App",
//   projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID as string,
//   chains,
// });

const config = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

// Remove the existing declaration of 'connectors'
// const { connectors } = getDefaultWallets({

// Add the corrected declaration

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  return (
    <WagmiConfig config={config}>
      <RainbowKitProvider chains={chains} appInfo={demoAppInfo}>
        {mounted && children}
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
