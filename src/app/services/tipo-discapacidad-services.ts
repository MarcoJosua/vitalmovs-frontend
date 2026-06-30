import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TipoDiscapacidad } from '../models/tipodiscapacidadDTO';


@Injectable({ providedIn: 'root' })
export class TipoDiscapacidadService {
  private baseUrl = 'http://localhost:8080/vitalmovs';

  constructor(private http: HttpClient) {}

  listAll(): Observable<TipoDiscapacidad[]> {
    return this.http.get<TipoDiscapacidad[]>(`${this.baseUrl}/tipoDiscapacidad/tipos`);
  }

  add(tipo: TipoDiscapacidad): Observable<TipoDiscapacidad> {
    return this.http.post<TipoDiscapacidad>(`${this.baseUrl}/TipoDiscapacidad`, tipo);
  }

  update(tipo: TipoDiscapacidad): Observable<TipoDiscapacidad> {
    return this.http.put<TipoDiscapacidad>(`${this.baseUrl}/TipoDiscapacidad`, tipo);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/TipoDiscapacidad/${id}`);
  }

  buscarPorNombre(nombre: string): Observable<TipoDiscapacidad[]> {
    return this.http.get<TipoDiscapacidad[]>(`${this.baseUrl}/tipoDiscapacidad/buscarNombre/${nombre}`);
  }

  buscarPorDescripcion(keyword: string): Observable<TipoDiscapacidad[]> {
    return this.http.get<TipoDiscapacidad[]>(`${this.baseUrl}/tipoDiscapacidad/buscarDescripcion/${keyword}`);
  }
}
