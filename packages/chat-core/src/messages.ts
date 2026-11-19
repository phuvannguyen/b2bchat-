import type { Message, SendMessageInput } from '@repo/contracts';

export type DeliveryStatus = 'pending' | 'sent' | 'failed';
export type LocalMessage = Message & { status: DeliveryStatus };

/** Builds the optimistic copy shown immediately while the server confirms. */
export function createPendingMessage(
  input: SendMessageInput,
  senderId: string,
  now: Date = new Date(),
): LocalMessage {
  return {
    ...input,
    id: `local:${input.clientId}`,
    senderId,
    createdAt: now.toISOString(),
    status: 'pending',
  };
}

/**
 * Merges server messages into the local list: the server copy replaces the
 * optimistic one (same clientId), duplicates are dropped, order is by time.
 */
export function mergeMessages(
  current: readonly LocalMessage[],
  incoming: readonly Message[],
): LocalMessage[] {
  const byClientId = new Map<string, LocalMessage>();
  for (const message of current) byClientId.set(message.clientId, message);
  for (const message of incoming) {
    byClientId.set(message.clientId, { ...message, status: 'sent' });
  }
  return [...byClientId.values()].sort(
    (a, b) =>
      a.createdAt.localeCompare(b.createdAt) || a.id.localeCompare(b.id),
  );
}

export function markFailed(
  current: readonly LocalMessage[],
  clientId: string,
): LocalMessage[] {
  return current.map((message) =>
    message.clientId === clientId && message.status === 'pending'
      ? { ...message, status: 'failed' }
      : message,
  );
}
