import { Controller, UseFilters, UsePipes, ValidationPipe } from "@nestjs/common";
import { GrpcExceptionsFilter } from "@duongtrungnguyen/micro-commerce";
import { RpcException } from "@nestjs/microservices";
import { Observable } from "rxjs";

import { GetUserRequest, UpdateUserRequest, UserServiceController, UserServiceControllerMethods, UserResponse, GetUsersRequest, UsersResponse } from "./tsprotos";
import { UserGrpcService } from "./user-grpc.service";

@Controller()
@UserServiceControllerMethods()
@UseFilters(GrpcExceptionsFilter)
@UsePipes(new ValidationPipe({ exceptionFactory: (errors) => new RpcException(errors) }))
export class UserGrpcController implements UserServiceController {
  constructor(private readonly userGrpcService: UserGrpcService) {}

  update(request: UpdateUserRequest): Promise<UserResponse> | Observable<UserResponse> | UserResponse {
    return this.userGrpcService.update(request);
  }

  get(request: GetUserRequest): Promise<UserResponse> | Observable<UserResponse> | UserResponse {
    return this.userGrpcService.get(request);
  }

  getUsers(request: GetUsersRequest): Promise<UsersResponse> | Observable<UsersResponse> | UsersResponse {
    return this.userGrpcService.getUsers(request);
  }
}
