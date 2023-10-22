// import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import {
  getDefaultWallets,
  midnightTheme,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, mainnet, WagmiConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import ClientProvider from "@/contexts/ClientContext";
import "@rainbow-me/rainbowkit/styles.css";
import "@/styles/globals.css";
import "@/styles/index.scss";
import WalletContext from "@/contexts/WalletContext";

const MumbaiEVM = {
  id: 80001,
  name: "Mumbai",
  network: "Mumbai Testnet",
  iconUrl:
    "https://cdn.dorahacks.io/static/files/188c028468557368d12717c46b1bd63e.jpg",
  iconBackground: "#fff",
  nativeCurrency: {
    name: "MATIC",
    symbol: "MATIC",
    decimals: 18,
  },
  rpcUrls: {
    public: { http: ["https://rpc.ankr.com/polygon_mumbai"] },
    default: { http: ["https://rpc.ankr.com/polygon_mumbai"] },
  },
  blockExplorers: {
    default: { name: "polygonscan", url: "https://mumbai.polygonscan.com" },
  },
  testnet: true,
};

const SepoliaEVM = {
  id: 534351,
  name: "Sepolia",
  network: "Sepolia Testnet",
  iconUrl: "https://img.api.cryptorank.io/coins/scroll1662388084493.png",
  iconBackground: "#fff",
  nativeCurrency: {
    name: "ETH",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: {
    public: { http: ["https://1rpc.io/scroll/sepolia"] },
    default: { http: ["https://1rpc.io/scroll/sepolia"] },
  },
  blockExplorers: {
    default: {
      name: "Blockscout",
      url: "https://sepolia-blockscout.scroll.io/",
    },
  },
  testnet: true,
};

export default function App({ Component, pageProps }) {
  const [ready, setReady] = useState(false);

  const { publicClient, chains } = configureChains(
    [mainnet, MumbaiEVM],
    [publicProvider()]
  );

  const { connectors } = getDefaultWallets({
    appName: "DexTech",
    projectId: "68c961d33487e0adae591fc2bccae7b3",
    chains,
  });

  const wagmiConfig = createConfig({
    autoConnect: true,
    connectors,
    publicClient,
  });

  useEffect(() => {
    setReady(true);
  }, []);

  return (
    <>
      {ready ? (
        <ClientProvider>
          <WagmiConfig config={wagmiConfig}>
            <RainbowKitProvider
              chains={chains}
              theme={midnightTheme({
                accentColor: "#2563eb",
                accentColorForeground: "white",
                borderRadius: "large",
                fontStack: "system",
                overlayBlur: "small",
              })}
            >
              <WalletContext>
                <Component {...pageProps} />
              </WalletContext>
            </RainbowKitProvider>
          </WagmiConfig>
        </ClientProvider>
      ) : null}
    </>
  );
}
