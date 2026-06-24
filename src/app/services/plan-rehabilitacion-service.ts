import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PlanRehabilitacionDTO } from '../models/PlanRehabilitacionDTO';

@Injectable({
  providedIn: 'root',
})
export class PlanRehabilitacionService {
  ruta_servidor: string = "http://localhost:8080/vitalmovs";
  recurso: string ="planes"
  
  constructor(private http:HttpClient){}

   listAll() { return this.http.get<PlanRehabilitacionDTO[]>( this.ruta_servidor + "/" + this.recurso);}

   add(plan: PlanRehabilitacionDTO) { return this.http.post<PlanRehabilitacionDTO>( this.ruta_servidor + "/" + this.recurso, plan);}

   update(plan: PlanRehabilitacionDTO) { return this.http.put<PlanRehabilitacionDTO>(this.ruta_servidor + "/" + this.recurso, plan);}

   delete(id: number) {return this.http.delete(this.ruta_servidor + "/" + this.recurso + "/" + id.toString());}

   findByUserId(id: number) {return this.http.get<PlanRehabilitacionDTO[]>( this.ruta_servidor + "/" + this.recurso + "/usuario/" + id.toString());}

   getById(id: number) { return this.http.get<PlanRehabilitacionDTO>( this.ruta_servidor + "/" + this.recurso + "/" + id.toString());}

}
