import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Paciente } from '../models/pacienteDTO';


@Injectable({ providedIn: 'root' })
export class PacienteService {
  private baseUrl = 'http://localhost:8080/vitalmovs';

  constructor(private http: HttpClient) {}

  listAll(): Observable<Paciente[]> {
    return this.http.get<Paciente[]>(`${this.baseUrl}/paciente/pacientes`);
  }

  add(paciente: Paciente): Observable<Paciente> {
    return this.http.post<Paciente>(`${this.baseUrl}/Paciente`, paciente);
  }

  update(paciente: Paciente): Observable<Paciente> {
    return this.http.put<Paciente>(`${this.baseUrl}/Paciente`, paciente);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/Paciente/${id}`);
  }

  buscarPorNombre(nombre: string): Observable<Paciente[]> {
    return this.http.get<Paciente[]>(`${this.baseUrl}/paciente/buscarNombre/${nombre}`);
  }

  buscarPorSexo(sexo: string): Observable<Paciente[]> {
    return this.http.get<Paciente[]>(`${this.baseUrl}/paciente/buscarSexo/${sexo}`);
  }

  buscarPorEdadMayor(edad: number): Observable<Paciente[]> {
    return this.http.get<Paciente[]>(`${this.baseUrl}/paciente/buscarEdad/${edad}`);
  }

  buscarPorTipoDiscapacidad(tipoId: number): Observable<Paciente[]> {
    return this.http.get<Paciente[]>(`${this.baseUrl}/paciente/buscarPorTipo/${tipoId}`);
  }

  findByUserId(userId: number) {
        return this.http.get<Paciente>(`${this.baseUrl}/paciente/user/${userId}`
      );
  }

  
}
