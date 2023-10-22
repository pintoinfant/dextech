import { ReactElement, useEffect } from "react";
import { Conversation, Message } from "../model/db";
import { useMessages } from "../hooks/useMessages";
import MessageComposerView from "./MessageComposerView";
import MessageCellView from "./MessageCellView";
// import Link from "next/link";
import Header from "../components/Header";
// import { Cog6ToothIcon } from "@heroicons/react/24/solid";
import { useLiveConversation } from "../hooks/useLiveConversation";
// import ConversationSettingsView from "./ConversationSettingsView";
import { ContentTypeId } from "@xmtp/xmtp-js";
import { ContentTypeReaction } from "@xmtp/content-type-reaction";
import { useReadReceipts } from "../hooks/useReadReceipts";
import Head from "next/head";

const appearsInMessageList = (message: Message): boolean => {
  if (ContentTypeReaction.sameAs(message.contentType as ContentTypeId)) {
    return false;
  }

  return true;
};

export default function ConversationView({
  conversation,
}: {
  conversation: Conversation;
}): ReactElement {
  const liveConversation = useLiveConversation(conversation);
  const messages = useMessages(conversation);
  const showReadReceipt = useReadReceipts(conversation);
  // const [isShowingSettings, setIsShowingSettings] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 100000, behavior: "smooth" });
    console.log(messages);
  }, [messages?.length]);

  useEffect(() => {
    console.log("Conversations updated: ", conversation);
  }, [conversation]);

  return (
    <div>
      <Head>
        <style>
          {`
          /* width */
          ::-webkit-scrollbar {
            width: 5px;
          }
          
          /* Track */
          ::-webkit-scrollbar-track {
            background: #111827;
          }
          
          /* Handle */
          ::-webkit-scrollbar-thumb {
            background: #1f2937;
          }
          
          /* Handle on hover */
          ::-webkit-scrollbar-thumb:hover {
            background: #555;
          }
          `}
        </style>
      </Head>
      <Header peerAddress={conversation.peerAddress}>
        <div className="flex justify-between font-bold">
          <span className="flex-grow text-white font-black">
            Chatting with {liveConversation?.title || conversation.peerAddress}
          </span>
          {/* <div className="space-x-4">
            <button
              className="inline-block space-x-1 text-zinc-600"
              onClick={() => {
                setIsShowingSettings(!isShowingSettings);
              }}
            >
              <Cog6ToothIcon className="h-4 inline-block align-top" />
              <span>Settings</span>
            </button> 
            <Link className="text-blue-700" href="/">
              Go Back
            </Link> 
          </div>*/}
        </div>
        {/* {isShowingSettings && (
          <ConversationSettingsView
            conversation={conversation}
            dismiss={() => setIsShowingSettings(false)}
          />
        )} */}
      </Header>
      <div className="mt-2 h-[365px] overflow-y-scroll">
        {messages?.length == 0 && <p>No messages yet.</p>}
        {messages ? (
          messages.reduce((acc: ReactElement[], message: Message, index) => {
            const showRead = showReadReceipt && index === messages.length - 1;
            if (appearsInMessageList(message)) {
              acc.push(
                <MessageCellView
                  key={message.id}
                  message={message}
                  readReceiptText={showRead ? "Read" : undefined}
                  peerAddress={conversation.peerAddress}
                />
              );
            }

            return acc;
          }, [] as ReactElement[])
        ) : (
          <span>Could not load messages</span>
        )}
      </div>
      <MessageComposerView conversation={conversation} />
    </div>
  );
}
