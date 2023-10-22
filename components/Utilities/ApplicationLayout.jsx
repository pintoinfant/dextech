import { Fragment, useEffect, useState } from "react";
import { Dialog, Disclosure, Transition } from "@headlessui/react";
import { useRouter } from "next/router";
import {
  Bars3Icon,
  MagnifyingGlassIcon,
  UserPlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { CONTRACT_ABIS, CONTRACT_ADDRESS } from "@/utilities/contractDetails";
import { ConnectButton, useConnectModal } from "@rainbow-me/rainbowkit";
import {
  useAccount,
  useContractRead,
  useContractWrite,
  useDisconnect,
  useNetwork,
} from "wagmi";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { Client } from "@xmtp/xmtp-js";
import { useEthersSigner } from "@/utilities/ethers";

export default function ApplicationLayout({ children }) {
  const router = useRouter();
  const [openRegisterTraderModal, setOpenRegisterTraderModal] = useState(false);
  const { address, isConnecting, isConnected, isDisconnected } = useAccount();
  const { chain } = useNetwork();
  const [inputs, setInputs] = useState({
    contractName: "",
    contractSymbol: "",
  });
  const { openConnectModal } = useConnectModal();

  const signer = useEthersSigner({ chainId: chain?.id });

  const disconnect = useDisconnect({
    onSuccess() {
      openConnectModal();
    },
  });

  // Open Rainbowkit if not signed in
  useEffect(() => {
    if (!isConnected) {
      openConnectModal();
    }
    // if (isDisconnected) {
    //   openConnectModal();
    // }
  }, [isConnected, isDisconnected]);

  const handleInput = (event) => {
    event.persist();
    setInputs((prev) => ({
      ...prev,
      [event.target.id]: event.target.value,
    }));
  };

  // Function to create trader token
  const {
    data: createTraderTokenData,
    isLoading: createTraderTokenIsLoading,
    isSuccess: createTraderTokenIsSuccess,
    write: createTraderToken,
  } = useContractWrite({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABIS.FactoryContract.abi,
    functionName: "createTraderToken",
  });

  const {
    data: getTraderContractData,
    isLoading: getTraderContractLoading,
    refetch: refetchGetTraderContractData,
  } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABIS.FactoryContract.abi,
    functionName: "getTraderContract",
    args: [address],
  });

  const handleTraderTokenCreation = async (event) => {
    event.preventDefault();
    await createTraderToken({
      args: [inputs.contractName, inputs.contractSymbol],
    });

    // Read contract we just created
    const traderContractData = await refetchGetTraderContractData();
    console.log(traderContractData.data);

    const xmtp = await Client.create(signer, { env: "production" });

    const isOnDevNetwork = await xmtp.canMessage(
      "0x64574dDbe98813b23364704e0B00E2e71fC5aD17"
    );

    if (!isOnDevNetwork) {
      const conversation = await xmtp.conversations.newConversation(
        "0x64574dDbe98813b23364704e0B00E2e71fC5aD17"
      );
      const message = await conversation.send("gm");

      console.log(message);
    } else {
      const conversation = await xmtp.conversations.newConversation(
        "0x64574dDbe98813b23364704e0B00E2e71fC5aD17"
      );
      const message = await conversation.send("gm");
      console.log(message);
      if (message.content === "gm") {
        setOpenRegisterTraderModal(false);
      }
    }
  };

  return (
    <>
      <Head>
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
            -webkit-text-fill-color: #fff;
            -webkit-box-shadow: 0 0 0px 1000px #00000000 inset;
            transition: background-color 5000s ease-in-out 0s;
          }
          input::placeholder {
            -webkit-text-fill-color: #a1a1aa;
          }
          .rainbow-kit-connect-button > div > button {
            border-radius: 9999px !important;
          }
        `}
        </style>
      </Head>
      {address && (
        <>
          <Disclosure as="nav" className="bg-gray-900">
            {({ open }) => (
              <>
                <div className="px-2 sm:px-4 lg:px-8">
                  <div className="grid grid-cols-12 h-16">
                    <div className="col-span-6 flex items-center px-2 lg:px-0">
                      <div className="flex-shrink-0 flex items-center">
                        <Image
                          className="h-12 w-auto"
                          src="/logo/dex-logo.png"
                          alt="Dex Tech"
                          width={1920}
                          height={1080}
                        />
                        <div className="font-black text-white text-xl">
                          DexTech
                        </div>
                      </div>
                      <div className="hidden lg:ml-12 lg:block">
                        <div className="flex space-x-4">
                          <Link
                            href="/swap"
                            className={`rounded-md px-3 py-2 text-sm font-medium hover:text-white ${
                              router.pathname === "/swap"
                                ? "text-white bg-gray-800"
                                : "text-gray-300"
                            }`}
                          >
                            Swap
                          </Link>
                          <Link
                            href="/top-traders"
                            className={`rounded-md px-3 py-2 text-sm font-medium hover:text-white ${
                              router.pathname === "/top-traders"
                                ? "text-white bg-gray-800"
                                : "text-gray-300 bg-gray-900"
                            }`}
                          >
                            Top Traders
                          </Link>
                          <Link
                            href="/chat"
                            className={`rounded-md px-3 py-2 text-sm font-medium hover:text-white ${
                              router.pathname === "/chat"
                                ? "text-white bg-gray-800"
                                : "text-gray-300"
                            }`}
                          >
                            Chat
                          </Link>
                        </div>
                      </div>
                    </div>
                    {/* <div className="col-span-4 flex flex-1 items-center justify-center px-2 lg:ml-6">
                      <div className="w-full max-w-lg lg:max-w-xs border-2 border-gray-800 rounded-2xl overflow-hidden">
                        <label htmlFor="search" className="sr-only">
                          Search
                        </label>
                        <div className="relative">
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <MagnifyingGlassIcon
                              className="h-5 w-5 text-gray-400"
                              aria-hidden="true"
                            />
                          </div>
                          <input
                            id="search"
                            name="search"
                            className="block w-full rounded-md border-0 bg-gray-900 py-1.5 pl-10 pr-3 text-white placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                            placeholder="Search"
                            type="search"
                          />
                        </div>
                      </div>
                    </div> */}
                    <div className="flex lg:hidden">
                      {/* Mobile menu button */}
                      <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                        <span className="absolute -inset-0.5" />
                        <span className="sr-only">Open main menu</span>
                        {open ? (
                          <XMarkIcon
                            className="block h-6 w-6"
                            aria-hidden="true"
                          />
                        ) : (
                          <Bars3Icon
                            className="block h-6 w-6"
                            aria-hidden="true"
                          />
                        )}
                      </Disclosure.Button>
                    </div>
                    <div className="col-span-6 hidden lg:ml-4 lg:block">
                      <div className="h-full flex items-center justify-end">
                        <button
                          type="button"
                          onClick={() => setOpenRegisterTraderModal(true)}
                          className="ml-4 rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-zinc-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-100"
                        >
                          Register As Trader
                        </button>
                        <div className="ml-2 rainbow-kit-connect-button">
                          <ConnectButton
                            chainStatus="none"
                            showBalance={false}
                            label="Connect"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </Disclosure>
          <div>{children}</div>

          {/* Register Trader Modal Start */}
          <Transition.Root show={openRegisterTraderModal} as={Fragment}>
            <Dialog
              as="div"
              className="relative z-10"
              onClose={setOpenRegisterTraderModal}
            >
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
              </Transition.Child>

              <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    enterTo="opacity-100 translate-y-0 sm:scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                    leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  >
                    <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-gray-900 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                      <div className="sm:flex sm:items-start">
                        <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gray-700 sm:mx-0 sm:h-10 sm:w-10">
                          <UserPlusIcon
                            className="h-6 w-6 text-gray-400"
                            aria-hidden="true"
                          />
                        </div>
                        <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                          <Dialog.Title
                            as="h3"
                            className="text-base font-semibold leading-6 text-white"
                          >
                            Register Yourself As A Trader
                          </Dialog.Title>
                          <div className="mt-2">
                            <p className="text-sm text-gray-200">
                              Create a collection of NFTs for yourself that will
                              act as keys, allowing other traders who hold your
                              keys to interact with you.
                            </p>
                          </div>
                        </div>
                      </div>
                      {/* Register Trader Form Start */}
                      <form onSubmit={handleTraderTokenCreation}>
                        <div className="mt-5 rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-700 focus-within:ring-2 focus-within:ring-blue-600">
                          <label
                            htmlFor="contractName"
                            className="block text-xs font-medium text-gray-200"
                          >
                            Contract Name
                          </label>
                          <input
                            type="text"
                            name="contractName"
                            id="contractName"
                            onChange={handleInput}
                            value={inputs.contractName}
                            className="block w-full border-0 p-0 text-white font-bold placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 bg-gray-900"
                            placeholder="Danny's Token Contract"
                          />
                        </div>

                        <div className="mt-3 rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-700 focus-within:ring-2 focus-within:ring-blue-600">
                          <label
                            htmlFor="contractSymbol"
                            className="block text-xs font-medium text-gray-200"
                          >
                            Contract Symbol
                          </label>
                          <input
                            type="text"
                            name="contractSymbol"
                            id="contractSymbol"
                            onChange={handleInput}
                            value={inputs.contractSymbol}
                            className="block w-full border-0 p-0 text-white font-bold placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 bg-gray-900"
                            placeholder="DC"
                          />
                        </div>

                        <button
                          type="submit"
                          className="mt-4 w-full rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                        >
                          Next
                        </button>
                      </form>
                      {/* Register Trader Form End */}
                    </Dialog.Panel>
                  </Transition.Child>
                </div>
              </div>
            </Dialog>
          </Transition.Root>
        </>
      )}
      {/* Register Trader Modal End */}
    </>
  );
}
