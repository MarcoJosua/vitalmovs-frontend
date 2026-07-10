import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PacienteDiscapacidad } from '../models/pacientediscapacidadDTO';


@Injectable({ providedIn: 'root' })
export class PacienteDiscapacidadService {
  private baseUrl = 'http://localhost:8080/vitalmovs';

  constructor(private http: HttpClient) {}

  findByPacienteId(pacienteId: number): Observable<PacienteDiscapacidad[]> {
    return this.http.get<PacienteDiscapacidad[]>(`${this.baseUrl}/pacienteDiscapacidad/paciente/${pacienteId}`);
  }

  add(pd: PacienteDiscapacidad): Observable<PacienteDiscapacidad> {
    return this.http.post<PacienteDiscapacidad>(`${this.baseUrl}/pacienteDiscapacidad`, pd);
  }

  update(pd: PacienteDiscapacidad): Observable<PacienteDiscapacidad> {
    return this.http.put<PacienteDiscapacidad>(`${this.baseUrl}/pacienteDiscapacidad`, pd);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/pacienteDiscapacidad/${id}`);
  }

  countByTipo(tipoId: number): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/pacienteDiscapacidad/contar/${tipoId}`);
  }
}
