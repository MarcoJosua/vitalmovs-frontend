import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EjercicioDTO } from '../models/EjercicioDTO';

@Injectable({
  providedIn: 'root',
})
export class EjercicioService {
  ruta_servidor: string = "http://localhost:8080/vitalmovs";
  recurso: string ="ejercicio"
  
  constructor(private http:HttpClient){}

    listAll() { return this.http.get<EjercicioDTO[]>( this.ruta_servidor + "/" + this.recurso);}
}
