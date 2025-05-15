import { TypeOrmExceptionInterceptor } from "@duongtrungnguyen/micro-commerce";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { createNestroApplication, getFreePort } from "@duongtrungnguyen/nestro";
import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { I18nService } from "nestjs-i18n";
import * as path from "path";

import { AppModule } from "./app.module";

async function bootstrap() {
  const configService: ConfigService = new ConfigService();
  const port = await getFreePort();

  const grpcUrl = `${configService.getOrThrow<string>("SERVICE_HOST")}:${port}`;

  const app = await createNestroApplication(AppModule, {
    server: {
      host: configService.getOrThrow<string>("NESTRO_HOST"),
      port: configService.getOrThrow<number>("NESTRO_PORT"),
    },
    client: {
      name: configService.getOrThrow<string>("SERVICE_NAME"),
      port,
      metadata: {
        grpcUrl,
      },
    },
  });

  const i18nService = app.get<I18nService>(I18nService);

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new TypeOrmExceptionInterceptor(i18nService));

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: "user",
      url: grpcUrl,
      protoPath: path.join(__dirname, "user-grpc", "protos", "user.proto"),
    },
  });

  app.startAllMicroservices();
  await app.listen();
}
bootstrap();
