import { ReactNode } from "react";
import { useRouter } from "next/router";
import { useAccount } from "wagmi";
import { ReactElement, useEffect, useState } from "react";
import { useConversations } from "../hooks/useConversations";
import { useClient } from "../hooks/useClient";
import Link from "next/link";
import { useLatestMessages } from "../hooks/useLatestMessages";
import ConversationCellView from "./ConversationCellView";

interface Props {
  children?: ReactNode;
}

export default function ApplicationLayout({ children }: Props) {
  const router = useRouter();
  const { address } = useAccount();
  const [readReceiptsEnabled, setReadReceiptsEnabled] = useState(
    window.localStorage.getItem("readReceiptsEnabled") === "true"
  );

  const client = useClient();
  const conversations = useConversations(client);
  const latestMessages = useLatestMessages(conversations);

  useEffect(() => {
    window.localStorage.setItem(
      "readReceiptsEnabled",
      String(readReceiptsEnabled)
    );
  }, [readReceiptsEnabled]);

  return (
    <div className="grid grid-cols-12">
      <div className="col-span-4">
        {conversations?.length == 0 && <p>No conversations yet.</p>}
        {conversations
          ? conversations.map((conversation, i) => (
              <Link
                href={`chat?conversationId=${conversation.topic}`}
                key={conversation.topic}
              >
                <ConversationCellView
                  conversation={conversation}
                  latestMessage={latestMessages[i]}
                />
              </Link>
            ))
          : "Could not load conversations"}
      </div>
      <div className="col-span-8">{children}</div>
    </div>
  );
}
