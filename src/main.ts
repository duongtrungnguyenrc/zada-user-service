import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { createNestroApplication, getFreePort } from "@duongtrungnguyen/nestro";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ConfigService } from "@nestjs/config";
import { I18nMiddleware } from "nestjs-i18n";
import * as path from "path";

import { AppModule } from "~app.module";

async function bootstrap() {
  const configService: ConfigService = new ConfigService();

  const grpcPort = await getFreePort();
  const grpcUrl = `${configService.getOrThrow<string>("SERVICE_HOST")}:${grpcPort}`;
  const serviceName = configService.getOrThrow<string>("SERVICE_NAME");

  const app = await createNestroApplication(AppModule, {
    server: {
      host: configService.getOrThrow<string>("NESTRO_HOST"),
      port: configService.getOrThrow<number>("NESTRO_PORT"),
    },
    client: {
      name: serviceName,
      host: configService.getOrThrow<string>("SERVICE_HOST"),
      port: configService.getOrThrow<number>("SERVICE_PORT"),
      metadata: {
        grpcUrl,
      },
    },
  });

  app.use(I18nMiddleware);
  app.setGlobalPrefix("users");

  const documentConfig = new DocumentBuilder().setTitle(serviceName).build();
  const swaggerDocument = SwaggerModule.createDocument(app, documentConfig);

  SwaggerModule.setup("api", app, swaggerDocument, {
    jsonDocumentUrl: "api-docs-json",
  });

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
