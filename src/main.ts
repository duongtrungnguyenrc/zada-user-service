import { TypeOrmExceptionInterceptor } from "@duongtrungnguyen/micro-commerce";
import { createNestroApplication } from "@duongtrungnguyen/nestro";
import { ValidationPipe } from "@nestjs/common";
import { I18nService } from "nestjs-i18n";

import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await createNestroApplication(AppModule, {
    server: {
      host: "localhost",
    },
    client: {
      name: process.env.SERVICE_NAME,
    },
  });

  const i18nService = app.get<I18nService>(I18nService);

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new TypeOrmExceptionInterceptor(i18nService));

  await app.listen();
}
bootstrap();
