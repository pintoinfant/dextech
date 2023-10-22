import Head from "next/head";
import { useRouter } from "next/router";
import ApplicationLayout from "@/components/Utilities/ApplicationLayout";
import {
  ChatBubbleLeftRightIcon,
  FaceSmileIcon,
  KeyIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { superShortenAddress } from "@/utilities/shortenAddress";
import formatCurrency from "@/utilities/formatCurrency";
import {
  useAccount,
  useContractRead,
  useContractWrite,
  useNetwork,
} from "wagmi";
import { ethers } from "ethers";
import { CONTRACT_ABIS, CONTRACT_ADDRESS } from "@/utilities/contractDetails";
import { Client } from "@xmtp/xmtp-js";
import BlockiesSvg from "blockies-react-svg";
import { useEthersSigner } from "@/utilities/ethers";

export default function TopTraders() {
  const { address } = useAccount();
  const router = useRouter();
  const [traders, setTraders] = useState();
  const [getCustomerTradersDataState, setGetCustomerTradersDataState] =
    useState([]);
  // const { startConversation } = useStartConversation();
  const { chain } = useNetwork();
  const signer = useEthersSigner({ chainId: chain?.id });

  useEffect(() => {
    axios
      .get("/api/getTraders")
      .then(function (response) {
        // handle success
        console.log(response.data);
        setTraders(response.data.topics);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
  }, []);

  const {
    data: getCustomerTradersData,
    isLoading: getCustomerTradersLoading,
    refetch: refetchGetCustomerTradersData,
  } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABIS.FactoryContract.abi,
    functionName: "getCustomerTraders",
    args: [address],
  });

  useEffect(() => {
    if (address) {
      refetchGetCustomerTradersData();
    }
  }, [address]);

  useEffect(() => {
    if (!getCustomerTradersLoading) {
      if (getCustomerTradersData.length > 0) {
        const formattedGetCustomerTradersData = getCustomerTradersData.map(
          (item) => {
            return item.toLowerCase();
          }
        );
        setGetCustomerTradersDataState(formattedGetCustomerTradersData);
        console.log(getCustomerTradersData);
      }
    }
  }, [getCustomerTradersData, getCustomerTradersLoading]);

  // Function to buy keys of a trader
  function buyKey(peerAddress, keyPrice) {
    const EtherToWeiKeyPrice = ethers.utils.parseUnits(
      String(keyPrice.toFixed(6)),
      "ether"
    );
    mintTokenForCustomer({
      args: [peerAddress, address, EtherToWeiKeyPrice],
    });
  }

  // Contract call to buy key
  const {
    data: mintTokenForCustomerData,
    isLoading: mintTokenForCustomerIsLoading,
    isSuccess: mintTokenForCustomerIsSuccess,
    write: mintTokenForCustomer,
  } = useContractWrite({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABIS.FactoryContract.abi,
    functionName: "mintTokenForCustomer",
  });

  // Check if key was minted to logged in user
  useEffect(() => {
    if (mintTokenForCustomerIsSuccess) {
      refetchGetCustomerTradersData();
    }
  }, [mintTokenForCustomerIsSuccess]);

  // Start conversation with a trader
  async function startConversationWithTrader(peerAddress) {
    // const conversation = await startConversation(peerAddress, "Hello!");
    const xmtp = await Client.create(signer, { env: "production" });
    const newConversation = await xmtp.conversations.newConversation(
      peerAddress
    );
    console.log(newConversation);
    // Redirect to chat
    const chatId = newConversation.topic
      .replace("/xmtp/0/", "")
      .replace("/proto", "");

    console.log(chatId);
    router.push(`/chat?conversationId=${chatId}`);
  }

  return (
    <>
      <Head>
        <title>Top Traders | DexTech - The First Gamified Social DEX</title>
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
          <div className="mt-16 mx-auto max-w-3xl border border-gray-800 shadow-[0_0px_60px_0px_rgba(37,99,235,0.3)] rounded-3xl p-3">
            {/* Table Start */}
            <div className="px-5">
              {traders && traders.length > 0 && (
                <table className="min-w-full divide-y divide-gray-800">
                  <thead>
                    <tr className="uppercase">
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-black text-white sm:pl-0"
                      >
                        Leaderboard
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-black text-white"
                      >
                        Total ROI
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-black text-white"
                      >
                        Total PNL
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-black text-white"
                      >
                        Key Price
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-black text-white"
                      >
                        Key Holders
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-black text-white"
                      ></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {traders.map((trader) => (
                      <tr key={trader._id}>
                        <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-0">
                          <Link
                            href={`https://app.zerion.io/${trader.id}`}
                            className="flex items-center"
                            target="_blank"
                          >
                            <div className="h-12 w-12 flex-shrink-0">
                              <BlockiesSvg
                                address={trader.id}
                                size={8}
                                scale={10}
                                caseSensitive={false}
                                className="h-12 w-12 rounded-lg"
                              />
                            </div>
                            <div className="ml-4">
                              <div className="font-medium text-white">
                                {superShortenAddress(trader.id)}
                              </div>
                              <div className="text-gray-400">
                                $
                                {formatCurrency(
                                  trader.attributes.total.positions
                                )}{" "}
                              </div>
                            </div>
                          </Link>
                        </td>
                        <td
                          className={`whitespace-nowrap px-3 py-5 font-bold text-base ${
                            trader.attributes.changes.percent_1d !== null &&
                            trader.attributes.changes.percent_1d < 0
                              ? "text-red-500"
                              : "text-green-500"
                          }`}
                        >
                          {trader.attributes.changes.percent_1d !== null
                            ? `${trader.attributes.changes.percent_1d.toFixed(
                                2
                              )}%`
                            : "-"}
                        </td>
                        <td className="whitespace-nowrap px-3 py-5 font-bold text-base text-gray-200">
                          $
                          {formatCurrency(
                            trader.attributes.changes.absolute_1d
                          )}
                        </td>
                        <td className="whitespace-nowrap px-3 py-5 font-bold text-base text-gray-200">
                          ${formatCurrency(trader.keyPrice * 1600)}
                        </td>
                        <td className="whitespace-nowrap px-3 py-5 font-bold text-base text-gray-200">
                          {trader.holderCount}
                        </td>
                        <td className="whitespace-nowrap px-3 py-5 font-bold text-base text-gray-200 cursor-pointer text-right">
                          {trader.id == address.toLowerCase() ? (
                            <button
                              type="button"
                              className="inline-flex items-center gap-x-1.5 rounded-full bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-200 cursor-not-allowed"
                            >
                              Hey You
                              <FaceSmileIcon
                                className="-mr-0.5 h-5 w-5"
                                aria-hidden="true"
                              />
                            </button>
                          ) : (
                            <>
                              {getCustomerTradersDataState.length > 0 &&
                              getCustomerTradersDataState.includes(
                                trader.id
                              ) ? (
                                <button
                                  type="button"
                                  onClick={() =>
                                    startConversationWithTrader(trader.id)
                                  }
                                  className="inline-flex items-center gap-x-1.5 rounded-full bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                                >
                                  Message
                                  <ChatBubbleLeftRightIcon
                                    className="-mr-0.5 h-5 w-5"
                                    aria-hidden="true"
                                  />
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() =>
                                    buyKey(trader.id, trader.keyPrice)
                                  }
                                  className="inline-flex items-center gap-x-1.5 rounded-full bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-200"
                                >
                                  Buy Key
                                  <KeyIcon
                                    className="-mr-0.5 h-5 w-5"
                                    aria-hidden="true"
                                  />
                                </button>
                              )}
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            {/* Table End */}
          </div>
        </div>
      </ApplicationLayout>
    </>
  );
}
