import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AsignacionDTO } from '../models/AsignacionDTO';

@Injectable({
  providedIn: 'root',
})
export class AsignacionService {

  ruta_servidor: string = "http://localhost:8080/vitalmovs";
  recurso: string ="asignaciones"
  
  constructor(private http:HttpClient){}

    listAll() { return this.http.get<AsignacionDTO[]>( this.ruta_servidor + "/" + this.recurso);}

    add(asignacionDTO: AsignacionDTO) { return this.http.post<AsignacionDTO>(this.ruta_servidor + "/" + this.recurso,asignacionDTO);}

    update(asignacionDTO: AsignacionDTO) { return this.http.put<AsignacionDTO>(this.ruta_servidor + "/" + this.recurso,asignacionDTO);}

    delete(id: number) { return this.http.delete(this.ruta_servidor + "/" + this.recurso + "/" + id.toString());}

    findByFisioterapeutaId(id: number) {return this.http.get<AsignacionDTO[]>(this.ruta_servidor + "/" + this.recurso + "/fisioterapeuta/" + id.toString());}
}
