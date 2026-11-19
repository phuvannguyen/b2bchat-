import { Test } from '@nestjs/testing';
import { HealthController } from './health.controller.js';

describe('HealthController', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('reports ok with the running version', async () => {
    vi.stubEnv('APP_VERSION', 'test-sha');
    const moduleRef = await Test.createTestingModule({
      controllers: [HealthController],
    }).compile();

    expect(moduleRef.get(HealthController).check()).toEqual({
      status: 'ok',
      version: 'test-sha',
    });
  });
});
