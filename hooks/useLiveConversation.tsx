import { Conversation } from "../model/db";
import { useLiveQuery } from "dexie-react-hooks";
import db from "../model/db";

// Keeps a conversation up to date with DB updates
export function useLiveConversation(conversation: Conversation): Conversation {
  return useLiveQuery(async () => {
    return db.conversations.where("topic").equals(conversation.topic).first();
  })!;
}
