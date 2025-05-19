import { from, map, Observable } from "rxjs";
import { Injectable } from "@nestjs/common";
import { In } from "typeorm";

import { IUser, UserService } from "~user";

import { GetUserRequest, UpdateUserRequest, UserServiceClient, UserVM, UserResponse, CreateUserRequest, GetUsersRequest, UsersResponse } from "./tsprotos";

@Injectable()
export class UserGrpcService implements UserServiceClient {
  constructor(private readonly userService: UserService) {}

  create(request: CreateUserRequest): Observable<UserResponse> {
    return from(this.userService.create(request.data)).pipe(map((user: UserVM) => ({ data: user })));
  }

  update(request: UpdateUserRequest): Observable<UserResponse> {
    return from(this.userService.update(request.filter, request.updates)).pipe(map((user: UserVM) => ({ data: user })));
  }

  get(request: GetUserRequest): Observable<UserResponse> {
    return from(this.userService.get(request.filter, request.select as (keyof IUser)[])).pipe(map((user: UserVM) => ({ data: user })));
  }

  getUsers(request: GetUsersRequest): Observable<UsersResponse> {
    return from(this.userService.getMultiple({ id: In(request.filter.ids || []) }, request.select as (keyof IUser)[])).pipe(
      map((users: Array<UserVM>) => ({ data: request.filter.ids.map((id) => users.find((user) => user.id === id)) })),
    );
  }
}
