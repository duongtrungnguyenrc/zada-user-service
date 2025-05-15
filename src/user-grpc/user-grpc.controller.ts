import { Controller, UseInterceptors } from "@nestjs/common";
import { Observable } from "rxjs";

import {
  CreateUserDto,
  GetCredentialDto,
  GetUserRequest,
  UpdateUserRequest,
  UserCredentialVM,
  UserServiceController,
  UserServiceControllerMethods,
  UserVM,
} from "./tsprotos";
import { UserGrpcService } from "./user-grpc.service";
import { GrpcExceptionInterceptor } from "~user-grpc/grpc-exception.interceptor";

@Controller()
@UserServiceControllerMethods()
@UseInterceptors(GrpcExceptionInterceptor)
export class UserGrpcController implements UserServiceController {
  constructor(private readonly userGrpcService: UserGrpcService) {}

  create(request: CreateUserDto): Promise<UserVM> | Observable<UserVM> | UserVM {
    return this.userGrpcService.create(request);
  }

  getCredential(
    request: GetCredentialDto,
  ): Promise<UserCredentialVM> | Observable<UserCredentialVM> | UserCredentialVM {
    return this.userGrpcService.getCredential(request);
  }

  update(request: UpdateUserRequest): Promise<UserVM> | Observable<UserVM> | UserVM {
    return this.userGrpcService.update(request);
  }

  get(request: GetUserRequest): Promise<UserVM> | Observable<UserVM> | UserVM {
    return this.userGrpcService.get(request);
  }
}
