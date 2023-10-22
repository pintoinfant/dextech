import { ReactElement } from "react";
import { Message, MessageAttachment } from "../model/db";
import { useAttachment } from "../hooks/useAttachment";
import { shortAddress } from "../util/shortAddress";
import { ContentTypeId, ContentTypeText } from "@xmtp/xmtp-js";
import {
  ContentTypeAttachment,
  ContentTypeRemoteAttachment,
} from "@xmtp/content-type-remote-attachment";
import { ContentTypeReply, Reply } from "@xmtp/content-type-reply";
import MessageRepliesView from "./MessageRepliesView";
import ReactionsView from "./ReactionsView";
import ReadReceiptView from "./ReadReceiptView";
import BlockiesSvg from "blockies-react-svg";

function ImageAttachmentContent({
  attachment,
}: {
  attachment: MessageAttachment;
}): ReactElement {
  const objectURL = URL.createObjectURL(
    new Blob([Buffer.from(attachment.data)], {
      type: attachment.mimeType,
    })
  );

  return (
    <img
      onLoad={() => {
        window.scroll({ top: 10000, behavior: "smooth" });
      }}
      className="rounded w-48"
      src={objectURL}
      title={attachment.filename}
    />
  );
}

function AttachmentContent({ message }: { message: Message }): ReactElement {
  const attachment = useAttachment(message);

  if (!attachment) {
    return <span className="text-zinc-500">Loading attachment…</span>;
  }

  if (attachment.mimeType.startsWith("image/")) {
    return <ImageAttachmentContent attachment={attachment} />;
  }

  return (
    <span>
      {attachment.mimeType} {attachment.filename || "no filename?"}
    </span>
  );
}

export function Content({
  content,
  contentType,
  message,
  peerAddress,
}: {
  content: any;
  contentType: ContentTypeId;
  message: any;
  peerAddress: any;
}): ReactElement {
  if (ContentTypeText.sameAs(contentType)) {
    return (
      <div
        className={`flex ${message.sentByMe ? "justify-end" : "justify-start"}`}
      >
        <div className="flex space-x-2">
          {!message.sentByMe && (
            <div className="relative h-7 w-7">
              <BlockiesSvg
                address={peerAddress}
                size={8}
                scale={10}
                caseSensitive={false}
                className="absolute top-3 h-7 w-7 rounded-full"
              />
            </div>
          )}
          <span
            className={`px-3 py-1 text-white text-sm ${
              message.sentByMe
                ? "bg-blue-500 rounded-l-full rounded-tr-full"
                : "bg-gray-700 rounded-r-full rounded-tl-full"
            }`}
          >
            {content}
          </span>
        </div>
      </div>
    );
  }

  if (ContentTypeReply.sameAs(contentType)) {
    const reply: Reply = content;
    return (
      <Content
        content={reply.content}
        contentType={reply.contentType}
        message={message}
        peerAddress={peerAddress}
      />
    );
  }

  return (
    <span className="text-zinc-500 break-all">
      Unknown content: {JSON.stringify(content)}
    </span>
  );
}

export function MessageContent({
  message,
  peerAddress,
}: {
  message: Message;
  peerAddress: any;
}): ReactElement {
  if (
    ContentTypeAttachment.sameAs(message.contentType as ContentTypeId) ||
    ContentTypeRemoteAttachment.sameAs(message.contentType as ContentTypeId)
  ) {
    return <AttachmentContent message={message} />;
  }

  return (
    <Content
      content={message.content}
      contentType={message.contentType as ContentTypeId}
      message={message}
      peerAddress={peerAddress}
    />
  );
}

export default function MessageCellView({
  message,
  readReceiptText,
  peerAddress,
}: {
  message: Message;
  readReceiptText: string | undefined;
  peerAddress: any;
}): ReactElement {
  return (
    <div>
      {/* <span
        title={message.sentByMe ? "You" : message.senderAddress}
        className={message.sentByMe ? "text-zinc-500" : "text-green-500"}
      >
        {shortAddress(message.senderAddress)}:
      </span> */}
      <div className="my-2">
        <MessageContent message={message} peerAddress={peerAddress} />
        {/* <MessageRepliesView message={message} />
        <ReactionsView message={message} />
        <ReadReceiptView readReceiptText={readReceiptText} /> */}
      </div>
    </div>
  );
}
