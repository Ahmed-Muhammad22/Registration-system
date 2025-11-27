import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const errorsInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((err) => {
      // Log error safely
      console.log('Interceptor Error:', {
        status: err.status,
        message: err.error.errors|| err.error.message,
        error: err.error
      });

      // Transform error to consistent format
      const errorResponse = {
        message: err.error.errors || err.error.message || 'An error occurred',
        status: err.status
      };

      return throwError(() => errorResponse);
    })
  );
};