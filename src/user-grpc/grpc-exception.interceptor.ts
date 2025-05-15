import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable, catchError, throwError } from "rxjs";
import { RpcException } from "@nestjs/microservices";
import { HttpException } from "@nestjs/common";

@Injectable()
export class GrpcExceptionInterceptor implements NestInterceptor {
  intercept(_: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        if (error instanceof RpcException) {
          return throwError(() => error);
        }

        if (error instanceof HttpException) {
          const status = error.getStatus();
          const message = error.message || "Unknown error";

          const grpcCode = this.mapHttpToGrpc(status);

          return throwError(() => new RpcException({ code: grpcCode, message }));
        }

        return throwError(() => new RpcException({ code: 13, message: error.message }));
      }),
    );
  }

  private mapHttpToGrpc(status: number): number {
    switch (status) {
      case 400:
        return 3; // INVALID_ARGUMENT
      case 401:
        return 16; // UNAUTHENTICATED
      case 403:
        return 7; // PERMISSION_DENIED
      case 404:
        return 5; // NOT_FOUND
      case 409:
        return 6; // ALREADY_EXISTS
      case 413:
        return 8; // RESOURCE_EXHAUSTED
      case 408:
      case 504:
        return 4; // DEADLINE_EXCEEDED
      case 429:
        return 8; // RESOURCE_EXHAUSTED (rate limit)
      case 500:
        return 13; // INTERNAL
      case 501:
        return 12; // UNIMPLEMENTED
      case 503:
        return 14; // UNAVAILABLE
      default:
        return 2; // UNKNOWN
    }
  }
}
