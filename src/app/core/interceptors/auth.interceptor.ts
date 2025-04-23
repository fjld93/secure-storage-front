import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const TOKEN_KEY = 'auth_token';

  const token = sessionStorage.getItem(TOKEN_KEY);

  if (!token) return next(req);

    const authReq = req.clone({
      headers: req.headers.set("Authorization", `Bearer ${token}`)      
    });

  return next(authReq);
};
