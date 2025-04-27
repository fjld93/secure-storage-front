import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ErrorHandlerService } from '@services/error-handler.service';
import { catchError, EMPTY } from 'rxjs';

export const errorHandlerInterceptor: HttpInterceptorFn = (req, next) => {

  const errorHandlerService: ErrorHandlerService = inject(ErrorHandlerService);
  
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      console.log(`Manejando el error: ${error}`);
      
      errorHandlerService.handleHttpError(error);
      return EMPTY;
    })
  );
};
