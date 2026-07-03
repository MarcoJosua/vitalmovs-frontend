import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EjercicioDTO } from '../models/EjercicioDTO';

@Injectable({
  providedIn: 'root',
})
export class EjercicioService {

  ruta_servidor: string = "http://localhost:8080/vitalmovs";
  recurso: string = "ejercicio";
  
  constructor(private http: HttpClient) {}

  listAll() {
    return this.http.get<EjercicioDTO[]>(this.ruta_servidor + "/" + this.recurso);
  }

  add(ejercicioDTO: EjercicioDTO) {
    return this.http.post<EjercicioDTO>(this.ruta_servidor + "/" + this.recurso, ejercicioDTO);
  }

  update(ejercicioDTO: EjercicioDTO) {
    return this.http.put<EjercicioDTO>(this.ruta_servidor + "/" + this.recurso, ejercicioDTO);
  }

  delete(id: number) {
    return this.http.delete(this.ruta_servidor + "/" + this.recurso + "/" + id.toString());
  }

  buscarPorNombreODescripcion(texto: string) {
    return this.http.get<EjercicioDTO[]>(this.ruta_servidor + "/" + this.recurso + "/buscar/" + texto);
  }
}