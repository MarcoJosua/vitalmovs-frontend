import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { TipoDiscapacidad } from '../models/tipodiscapacidadDTO';

@Injectable({
  providedIn: 'root'
})
export class TipoDiscapacidadService {

  private readonly baseUrl = 'http://localhost:8080/vitalmovs';
  private readonly recursoUrl =
    `${this.baseUrl}/tipoDiscapacidad`;

  constructor(private http: HttpClient) {}

  listAll(): Observable<TipoDiscapacidad[]> {
    return this.http.get<TipoDiscapacidad[]>(
      `${this.recursoUrl}/tipos`
    );
  }

  add(
    tipo: TipoDiscapacidad
  ): Observable<TipoDiscapacidad> {
    return this.http.post<TipoDiscapacidad>(
      this.recursoUrl,
      tipo
    );
  }

  update(
    tipo: TipoDiscapacidad
  ): Observable<TipoDiscapacidad> {
    return this.http.put<TipoDiscapacidad>(
      this.recursoUrl,
      tipo
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.recursoUrl}/${id}`
    );
  }

  buscarPorNombre(
    nombre: string
  ): Observable<TipoDiscapacidad[]> {
    return this.http.get<TipoDiscapacidad[]>(
      `${this.recursoUrl}/buscarNombre/${encodeURIComponent(nombre)}`
    );
  }

  buscarPorDescripcion(
    keyword: string
  ): Observable<TipoDiscapacidad[]> {
    return this.http.get<TipoDiscapacidad[]>(
      `${this.recursoUrl}/buscarDescripcion/${encodeURIComponent(keyword)}`
    );
  }
}