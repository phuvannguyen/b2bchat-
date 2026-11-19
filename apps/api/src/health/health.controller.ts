import { Controller, Get } from '@nestjs/common';
import { HealthResponse } from '@repo/contracts';

@Controller('health')
export class HealthController {
  @Get()
  check(): HealthResponse {
    return HealthResponse.parse({
      status: 'ok',
      version: process.env.APP_VERSION ?? 'dev',
    });
  }
}
