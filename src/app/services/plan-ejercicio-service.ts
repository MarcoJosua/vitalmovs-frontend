import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PlanEjercicioDTO } from '../models/PlanEjercicioDTO';

@Injectable({
  providedIn: 'root',
})
export class PlanEjercicioService {

   ruta_servidor: string = "http://localhost:8080/vitalmovs";
   recurso: string = "planEjercicio";

  constructor(private http: HttpClient) {}

  listAll() {
    return this.http.get<PlanEjercicioDTO[]>( this.ruta_servidor + "/" + this.recurso);
  }

  findByPlanIdOrdenado(planId: number) { 
    return this.http.get<PlanEjercicioDTO[]>( this.ruta_servidor + "/" + this.recurso + "/planOrdenado/" + planId.toString());
  }

  add(planEjercicio: PlanEjercicioDTO) {
    return this.http.post<PlanEjercicioDTO>( this.ruta_servidor + "/" + this.recurso, planEjercicio);
  }

  update(planEjercicio: PlanEjercicioDTO) {
    return this.http.put<PlanEjercicioDTO>( this.ruta_servidor + "/" + this.recurso,planEjercicio);
  }

  delete(id: number) {
    return this.http.delete( this.ruta_servidor + "/" + this.recurso + "/" + id.toString());
  }

}
