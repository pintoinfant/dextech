import { ReactElement } from "react";
import { Conversation, Message } from "../model/db";
import { shortAddress } from "../util/shortAddress";
import ReactTimeAgo from "react-time-ago";
import { MessageContent } from "./MessageCellViewOriginal";

export default function ConversationCellView({
  conversation,
  latestMessage,
}: {
  conversation: Conversation;
  latestMessage: Message | undefined;
}): ReactElement {
  return (
    <div className="p-2 bg-gray-900 border border-gray-800 rounded-2xl">
      <div className="flex items-center justify-between space-x-2">
        <div className="hover:underline">
          <span className="text-gray-100 text-sm font-bold">
            {conversation.title || shortAddress(conversation.peerAddress)}
          </span>{" "}
        </div>
        <div className="text-xs text-gray-400">
          <ReactTimeAgo date={conversation.updatedAt} />
        </div>
      </div>
      {latestMessage ? (
        <div className="block text-sm text-gray-200">
          <MessageContent message={latestMessage} />
        </div>
      ) : (
        <div className="block text-sm text-gray-400">No messages yet.</div>
      )}
    </div>
  );
}
