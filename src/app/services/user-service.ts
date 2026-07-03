import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserDTO } from '../models/userDTO';
import { TokenDTO } from '../models/tokenDTO';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  ruta_servidor: string = "http://localhost:8080/vitalmovs";
  recurso: string ="users"
  
  constructor(private http:HttpClient){}

  login(userDTO: UserDTO){    

      this.logout();

      return this.http.post<TokenDTO>(this.ruta_servidor+"/"+this.recurso+"/"+"login", userDTO).pipe(
        tap( (data:TokenDTO)=> {
          localStorage.setItem("jwtToken",data.jwtToken);
          localStorage.setItem("id",data.id.toString());
          localStorage.setItem("authorities",data.authorities);
        }
        )
      );
  }
  register(userDTO: UserDTO) {
    return this.http.post<UserDTO>(this.ruta_servidor + "/" + this.recurso + "/register", userDTO);
  }
  logout() {
    localStorage.clear();
  }

  getIdLogeado(): number {
    return Number(localStorage.getItem("id"));
  }

  getAuthoritiesLogeado(): string {
    return localStorage.getItem("authorities") || "";
  }

  getJwtTokenLogeado(): string {
    return localStorage.getItem("jwtToken") || "";
  }


}