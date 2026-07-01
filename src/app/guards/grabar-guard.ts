import { CanActivateFn } from '@angular/router';
import { UserService } from '../services/user-service';
import { inject } from '@angular/core';

export const grabarGuard: CanActivateFn = (route, state) => {
    const userService = inject(UserService);
    let authorities = userService.getAuthoritiesLogeado();
  
    if(authorities) {
      if (authorities.indexOf("ROLE_ADMIN")>=0 || authorities.indexOf("ROLE_FISIOTERAPEUTA")>=0 || authorities.indexOf("ROLE_PACIENTE")>=0) {
        return true;
      }
    }

    return false;
};