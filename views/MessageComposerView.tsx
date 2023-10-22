import {
  ChangeEvent,
  FormEvent,
  ReactElement,
  createRef,
  useCallback,
  useContext,
  useState,
} from "react";
import Button from "../components/Button";
import { useClient } from "../hooks/useClient";
import { Conversation } from "../model/db";
import { sendMessage } from "../model/messages";
import { ContentTypeText } from "@xmtp/xmtp-js";
import {
  Attachment,
  ContentTypeAttachment,
} from "@xmtp/content-type-remote-attachment";
import AttachmentPreviewView from "./AttachmentPreviewView";
import { MessageContent } from "./MessageCellViewOriginal";
import { shortAddress } from "../util/shortAddress";
import { ContentTypeReply, Reply } from "@xmtp/content-type-reply";
import { PaperAirplaneIcon, PaperClipIcon } from "@heroicons/react/24/outline";

export default function MessageComposerView({
  conversation,
}: {
  conversation: Conversation;
}): ReactElement {
  const [loading, setLoading] = useState(false);
  const [attachment, setAttachment] = useState<Attachment | undefined>();
  const [textInput, setTextInput] = useState("");

  const fileField = createRef<HTMLInputElement>();
  const client = useClient()!;

  function onSubmit(e: FormEvent) {
    e.preventDefault();

    (async () => {
      setLoading(true);

      // check for input
      if (textInput || attachment) {
        const finalContent = textInput || attachment;
        const finalContentType = textInput
          ? ContentTypeText
          : ContentTypeAttachment;
        // send regular message
        await sendMessage(client, conversation, finalContent, finalContentType);
      }

      // clear inputs
      setAttachment(undefined);
      setTextInput("");
      setLoading(false);
    })();
  }

  async function onChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files && e.target.files[0];

    if (!file) {
      return;
    }

    const arrayBuffer = await file.arrayBuffer();

    setAttachment({
      filename: file.name,
      mimeType: file.type,
      data: new Uint8Array(arrayBuffer),
    });

    window.scroll({ top: 10000, behavior: "smooth" });
  }

  return (
    <div className="bg-gray-900 rounded-3xl border border-zinc-800">
      <input
        ref={fileField}
        type="file"
        onChange={onChange}
        style={{ position: "absolute", marginLeft: "-10000px" }}
      />
      <form className="flex space-x-2 items-end" onSubmit={onSubmit}>
        {/* <div className="flex-grow border rounded bg-black p-2">
          {attachment && (
            <AttachmentPreviewView
              attachment={attachment}
              onDismiss={() => {
                setAttachment(undefined);
              }}
            />
          )}
          <div className="flex space-x-2">
            <button
              type="button"
              className="bg-blue-500 text-white rounded-full"
              // onClick={() => fileField.current?.click()}
            >
              +
            </button>
            <input
              type="text"
              placeholder={
                attachment ? "Press Send to send attachment" : "Type a message"
              }
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              name="text"
              autoComplete="off"
              disabled={!!attachment}
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
            />
          </div>
        </div> */}

        {/* <Button type="submit" className="mb-2">
          Send
        </Button> */}

        <div className="w-full p-2">
          <div className="flex rounded-md shadow-sm">
            <div className="w-full relative flex flex-grow items-stretch focus-within:z-10">
              {/* <div
                className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
                onClick={() => fileField.current?.click()}
              >
                <PaperClipIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </div> */}
              <input
                type="text"
                name="text"
                id="text"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                className="block w-full rounded-none rounded-l-md border-0 py-1.5 bg-gray-900 text-white ring-0 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                placeholder="Never gonna give you up..."
              />
            </div>
            <button
              type="submit"
              className="ml-px flex items-center space-x-1.5 rounded-3xl px-3 py-2 text-sm font-semibold bg-blue-600 text-gray-200 hover:bg-blue-500"
            >
              <span className="ml-1">Send</span>
              <PaperAirplaneIcon
                className="ml-2 h-5 w-5 text-gray-200"
                aria-hidden="true"
              />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
