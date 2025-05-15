import { FactoryProvider, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Auth, google } from "googleapis";

import { SessionModule } from "~auth/session";
import { JwtModule } from "~auth/jwt";
import { UserModule } from "~user";

import { GoogleOAuthStrategy } from "./strategies";
import { OAuthStrategyFactory } from "./factories";
import { OAUTH_CLIENT } from "./constants";

@Module({
  imports: [UserModule, JwtModule, SessionModule],
  providers: [
    {
      provide: OAUTH_CLIENT,
      useFactory: (configService: ConfigService) =>
        new google.auth.OAuth2(
          configService.get<string>("OAUTH_CLIENT_ID"),
          configService.get<string>("OAUTH_CLIENT_SECRET"),
          configService.get<string>("OAUTH_CALLBACK_URL"),
        ),
      inject: [ConfigService],
    } as FactoryProvider<Auth.OAuth2Client>,
    GoogleOAuthStrategy,
    OAuthStrategyFactory,
  ],
  exports: [GoogleOAuthStrategy, OAuthStrategyFactory],
})
export class OauthModule {}
