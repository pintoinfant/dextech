import { useEffect } from "react";
import Head from "next/head";
import ApplicationLayout from "@/components/Utilities/ApplicationLayout";
import { darkTheme, SwapWidget } from "@uniswap/widgets";
import { useEthersSigner } from "@/utilities/ethers";
import "@uniswap/widgets/fonts.css";

const jsonRpcUrlMap = {
  1: ["https://eth-mainnet.g.alchemy.com/v2/toazB2iE1mnm6oddkzmN0dTgBUXE03UD"],
};

export default function Home() {
  const signer: any = useEthersSigner();

  useEffect(() => {
    console.log(signer);
  }, [signer]);

  return (
    <>
      <Head>
        <title>Dashboard | DexTech - The First Gamified Social DEX</title>
        <style>
          {`input:-webkit-autofill,
          input:-webkit-autofill:hover, 
          input:-webkit-autofill:focus
          input:-webkit-autofill, 
          textarea:-webkit-autofill,
          textarea:-webkit-autofill:hover
          textarea:-webkit-autofill:focus,
          select:-webkit-autofill,
          select:-webkit-autofill:hover,
          select:-webkit-autofill:focus { 
            -webkit-text-fill-color: #000;
            -webkit-box-shadow: 0 0 0px 1000px #00000000 inset;
            transition: background-color 5000s ease-in-out 0s;
          }
          input::placeholder {
            -webkit-text-fill-color: #a1a1aa;
          }
          /* Chrome, Safari, Edge, Opera */
          input::-webkit-outer-spin-button,
          input::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }

          /* Firefox */
          input[type=number] {
            -moz-appearance: textfield;
          }
        `}
        </style>
      </Head>

      <ApplicationLayout>
        <div className="w-full">
          <div className="mt-16 mx-auto max-w-xl shadow-[0_0px_60px_0px_rgba(37,99,235,0.3)] rounded-3xl">
            {signer && (
              <SwapWidget
                width="100%"
                theme={darkTheme}
                provider={signer.data?.provider}
                jsonRpcUrlMap={jsonRpcUrlMap}
                hideConnectionUI={true}
              />
            )}
          </div>
        </div>
      </ApplicationLayout>
    </>
  );
}
