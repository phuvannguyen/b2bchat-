import { HealthResponse } from '@repo/contracts';
import { API_URL } from './config';

export async function fetchHealth(
  signal?: AbortSignal,
): Promise<HealthResponse> {
  const res = await fetch(`${API_URL}/health`, { signal });
  if (!res.ok) {
    throw new Error(`Health check failed with status ${res.status}`);
  }
  return HealthResponse.parse(await res.json());
}
