import type { INestApplication } from '@nestjs/common';

/** Shared by main.ts and the e2e tests so both run the same configuration. */
export function configureApp<T extends INestApplication>(app: T): T {
  app.setGlobalPrefix('api');
  app.enableShutdownHooks();

  // Production web is served from the same domain, so CORS is only needed in dev.
  const origins = process.env.CORS_ORIGINS?.split(',').map((o) => o.trim());
  app.enableCors({ origin: origins ?? process.env.NODE_ENV !== 'production' });

  return app;
}
