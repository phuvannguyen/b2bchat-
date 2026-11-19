import { z } from 'zod';
import { Id, Message, SendMessageInput } from './entities.js';

/** Realtime events. Changing a name or payload here is a breaking change for every client. */

export const ClientEvents = {
  'message.send': SendMessageInput,
  'typing.start': z.object({ conversationId: Id }),
  'read.mark': z.object({ conversationId: Id, messageId: Id }),
} as const;

export const ServerEvents = {
  'message.new': Message,
  'typing.update': z.object({
    conversationId: Id,
    userId: Id,
    isTyping: z.boolean(),
  }),
  'read.update': z.object({
    conversationId: Id,
    userId: Id,
    messageId: Id,
  }),
} as const;

export type ClientEventName = keyof typeof ClientEvents;
export type ServerEventName = keyof typeof ServerEvents;
export type ClientEventPayload<E extends ClientEventName> = z.infer<
  (typeof ClientEvents)[E]
>;
export type ServerEventPayload<E extends ServerEventName> = z.infer<
  (typeof ServerEvents)[E]
>;
