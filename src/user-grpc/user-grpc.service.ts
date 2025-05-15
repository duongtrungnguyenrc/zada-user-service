import { Injectable } from "@nestjs/common";
import { from, Observable } from "rxjs";

import { IUser, UserService } from "~user";

import {
  CreateUserDto,
  GetCredentialDto,
  GetUserRequest,
  UpdateUserRequest,
  UserCredentialVM,
  UserServiceClient,
  UserVM,
} from "./tsprotos";

@Injectable()
export class UserGrpcService implements UserServiceClient {
  constructor(private readonly userService: UserService) {}

  create(request: CreateUserDto): Observable<UserVM> {
    return from(this.userService.create(request));
  }

  getCredential(request: GetCredentialDto): Observable<UserCredentialVM> {
    return from(this.userService.getCredential(request.email));
  }

  update(request: UpdateUserRequest): Observable<UserVM> {
    return from(this.userService.updateUser(request.filter, request.updates));
  }

  get(request: GetUserRequest): Observable<UserVM> {
    return from(this.userService.getUser(request.filter, request.select as (keyof IUser)[]));
  }
}
