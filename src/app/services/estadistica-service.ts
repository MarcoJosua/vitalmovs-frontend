import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EstadisticaDTO } from '../models/EstadisticaDTO';
import { EstadisticaGraficoDTO } from '../models/EstadisticaGraficoDTO';

@Injectable({
  providedIn: 'root',
})
export class EstadisticaService {

  ruta_servidor: string = "http://localhost:8080/vitalmovs";
  recurso: string = "estadistica";

  constructor(private http: HttpClient) {}

  listAll() {
    return this.http.get<EstadisticaDTO[]>( this.ruta_servidor + "/" + this.recurso);
  }

  add(estadistica: EstadisticaDTO) {
    return this.http.post<EstadisticaDTO>( this.ruta_servidor + "/" + this.recurso,estadistica);
  }

  update(estadistica: EstadisticaDTO) {
    return this.http.put<EstadisticaDTO>( this.ruta_servidor + "/" + this.recurso,estadistica);
  }

  delete(id: number) {
    return this.http.delete( this.ruta_servidor + "/" + this.recurso + "/" + id.toString());
  }

  getById(id: number) {
    return this.http.get<EstadisticaDTO>( this.ruta_servidor + "/" + this.recurso + "/" + id.toString());
  }

  listByPlanEjercicioId(planEjercicioId: number) {
    return this.http.get<EstadisticaDTO[]>(this.ruta_servidor + "/" + this.recurso + "/planEjercicio/" + planEjercicioId.toString());
  }

  listByPlanRehabilitacionId(planId: number) {
    return this.http.get<EstadisticaDTO[]>(this.ruta_servidor + "/" + this.recurso + "/planRehabilitacion/" + planId.toString());
  }

  resumenGeneralPorPlan(planId: number) {
    return this.http.get<EstadisticaGraficoDTO>(this.ruta_servidor + "/" + this.recurso + "/dashboard/resumen/" + planId.toString());
  }

  evolucionPorFecha(planId: number) {
    return this.http.get<EstadisticaGraficoDTO[]>(this.ruta_servidor + "/" + this.recurso + "/dashboard/evolucion/" + planId.toString());
  }

  resumenPorEjercicio(planId: number) {
    return this.http.get<EstadisticaGraficoDTO[]>(this.ruta_servidor + "/" + this.recurso + "/dashboard/ejercicios/" + planId.toString());
  }
}
