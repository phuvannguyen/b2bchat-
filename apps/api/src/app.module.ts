import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module.js';

// Each feature (auth, workspaces, conversations, messages, ...) is its own module
// under src/<feature>/ and is registered here.
@Module({
  imports: [HealthModule],
})
export class AppModule {}
