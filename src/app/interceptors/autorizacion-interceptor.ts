import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { UserService } from '../services/user-service';

export const autorizacionInterceptor: HttpInterceptorFn = (req, next) => {
  
  const userService = inject(UserService);
  let jwtToken = userService.getJwtTokenLogeado();

  if(jwtToken && jwtToken!=""){
    let cloneRequest = req.clone({
      headers: req.headers.set("Authorization","Bearer "+jwtToken)
    });
    return next(cloneRequest);
  }
  return next(req);

};