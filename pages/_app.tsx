import type { AppProps } from "next/app";
import SiteLayout from "../components/Layout/SiteLayout";
import "../styles/globals.css";
import "../styles/reviews.scss";
import "../styles/company.scss";
import { publicProvider } from "wagmi/providers/public";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { WagmiConfig, createClient, configureChains, chain } from "wagmi";

function MyApp({ Component, pageProps }: AppProps) {
  const { chains, provider, webSocketProvider } = configureChains(
    [chain.goerli],
    [
      alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_KEY }),
      publicProvider(),
    ]
  );

  // set up client

  const client = createClient({
    autoConnect: true,
    provider,
    webSocketProvider,
    connectors: [new MetaMaskConnector({ chains })],
  });

  return (
    <WagmiConfig client={client}>
      <SiteLayout>
        <Component {...pageProps} />
      </SiteLayout>
    </WagmiConfig>
  );
}

export default MyApp;
