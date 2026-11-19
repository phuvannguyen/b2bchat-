import { render, screen } from '@testing-library/react-native';
import { ServerStatus } from './server-status';

const originalFetch = globalThis.fetch;

function mockFetch(impl: () => Promise<unknown>) {
  globalThis.fetch = jest.fn(impl) as unknown as typeof fetch;
}

describe('ServerStatus', () => {
  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it('shows the server version when the API is healthy', async () => {
    mockFetch(async () => ({
      ok: true,
      status: 200,
      json: async () => ({ status: 'ok', version: 'abc123' }),
    }));

    await render(<ServerStatus />);

    expect(await screen.findByText(/abc123/)).toBeTruthy();
  });

  it('shows an error when the API is unreachable', async () => {
    mockFetch(async () => {
      throw new Error('offline');
    });

    await render(<ServerStatus />);

    expect(await screen.findByText(/Không kết nối/)).toBeTruthy();
  });
});
