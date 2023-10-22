import { ReactElement } from "react";
import { Conversation, Message } from "../model/db";
import { shortAddress } from "../util/shortAddress";
import ReactTimeAgo from "react-time-ago";
import { MessageContent } from "./MessageCellViewOriginal";
import { useRouter } from "next/router";

export default function ConversationCellView({
  conversation,
  latestMessage,
}: {
  conversation: Conversation;
  latestMessage: Message | undefined;
}): ReactElement {
  const router = useRouter();

  return (
    <div
      className={`px-4 py-2 border border-gray-800 rounded-2xl ${
        conversation.topic === router.query.conversationId
          ? "bg-white"
          : "bg-gray-900"
      }`}
    >
      <div className="flex items-center justify-between space-x-2">
        <div className="hover:underline">
          <span
            className={`text-sm font-bold ${
              conversation.topic === router.query.conversationId
                ? "text-gray-900 font-black"
                : "text-gray-100"
            }`}
          >
            {conversation.title || shortAddress(conversation.peerAddress)}
          </span>{" "}
        </div>
        <div
          className={`text-xs ${
            conversation.topic === router.query.conversationId
              ? "text-gray-800"
              : "text-gray-400"
          }`}
        >
          <ReactTimeAgo date={conversation.updatedAt} />
        </div>
      </div>
      {latestMessage ? (
        <div
          className={`block text-sm ${
            conversation.topic === router.query.conversationId
              ? "text-gray-700"
              : "text-gray-200"
          }`}
        >
          <MessageContent message={latestMessage} />
        </div>
      ) : (
        <div className="block text-sm text-gray-400">No messages yet.</div>
      )}
    </div>
  );
}
