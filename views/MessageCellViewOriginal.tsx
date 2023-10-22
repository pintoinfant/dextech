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
}: {
  content: any;
  contentType: ContentTypeId;
  message: any;
}): ReactElement {
  if (ContentTypeText.sameAs(contentType)) {
    return (
      <div
        className={`flex ${message.sentByMe ? "justify-end" : "justify-start"}`}
      >
        <span
          className={`px-3 py-1 text-white rounded-full text-sm ${
            message.sentByMe ? "bg-blue-500" : "bg-gray-800"
          }`}
        >
          {content}
        </span>
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
}: {
  message: Message;
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
    />
  );
}

export default function MessageCellView({
  message,
  readReceiptText,
}: {
  message: Message;
  readReceiptText: string | undefined;
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
        <MessageContent message={message} />
        {/* <MessageRepliesView message={message} />
        <ReactionsView message={message} />
        <ReadReceiptView readReceiptText={readReceiptText} /> */}
      </div>
    </div>
  );
}
