import { describe, expect, it } from 'vitest';
import { ClientEvents, HealthResponse, Message } from './index.js';

const validMessage = {
  id: 'msg_1',
  conversationId: 'conv_1',
  senderId: 'user_1',
  clientId: '0b9f9a52-7a1e-4c55-9d1e-3b7c5f8f2a10',
  body: 'Xin chào',
  createdAt: '2026-11-19T08:00:00Z',
};

describe('contracts', () => {
  it('accepts a valid message', () => {
    expect(Message.parse(validMessage)).toEqual(validMessage);
  });

  it('rejects an empty message body', () => {
    expect(Message.safeParse({ ...validMessage, body: '' }).success).toBe(
      false,
    );
  });

  it('only lets clients send the fields they own', () => {
    const parsed = ClientEvents['message.send'].parse(validMessage);
    expect(Object.keys(parsed).sort()).toEqual([
      'body',
      'clientId',
      'conversationId',
    ]);
  });

  it('describes the health endpoint', () => {
    expect(
      HealthResponse.safeParse({ status: 'ok', version: 'dev' }).success,
    ).toBe(true);
  });
});
