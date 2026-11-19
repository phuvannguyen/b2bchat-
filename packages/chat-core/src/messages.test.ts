import type { Message } from '@repo/contracts';
import { describe, expect, it } from 'vitest';
import { createPendingMessage, markFailed, mergeMessages } from './index.js';

const clientId = '0b9f9a52-7a1e-4c55-9d1e-3b7c5f8f2a10';
const input = { conversationId: 'conv_1', clientId, body: 'Xin chào' };

const serverCopy: Message = {
  ...input,
  id: 'msg_1',
  senderId: 'user_1',
  createdAt: '2026-11-19T08:00:01Z',
};

describe('messages', () => {
  it('replaces the optimistic message with the server copy', () => {
    const pending = createPendingMessage(
      input,
      'user_1',
      new Date('2026-11-19T08:00:00Z'),
    );
    const merged = mergeMessages([pending], [serverCopy]);
    expect(merged).toEqual([{ ...serverCopy, status: 'sent' }]);
  });

  it('drops duplicates delivered twice by the server', () => {
    const merged = mergeMessages([], [serverCopy, serverCopy]);
    expect(merged).toHaveLength(1);
  });

  it('keeps messages in time order', () => {
    const older: Message = {
      ...serverCopy,
      id: 'msg_0',
      clientId: '5d2f3c1e-8f7a-4b6d-9c0e-1a2b3c4d5e6f',
      createdAt: '2026-11-19T07:59:00Z',
    };
    const merged = mergeMessages([], [serverCopy, older]);
    expect(merged.map((m) => m.id)).toEqual(['msg_0', 'msg_1']);
  });

  it('marks only the pending message as failed', () => {
    const pending = createPendingMessage(input, 'user_1');
    expect(markFailed([pending], clientId)[0]?.status).toBe('failed');
  });
});
