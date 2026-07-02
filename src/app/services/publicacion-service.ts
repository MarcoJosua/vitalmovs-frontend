import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Publicacion } from '../models/PublicacionDTO';

@Injectable({
  providedIn: 'root'
})
export class PublicacionService {

  private baseUrl = 'http://localhost:8080/vitalmovs';

  constructor(private http: HttpClient) {}

  listByForoId(foroId: number): Observable<Publicacion[]> {
    return this.http.get<Publicacion[]>(`${this.baseUrl}/publicaciones/${foroId}`);
  }

  listByRelevancia(foroId: number): Observable<Publicacion[]> {
    return this.http.get<Publicacion[]>(`${this.baseUrl}/publicaciones/relevancia/${foroId}`);
  }

  add(publicacion: Publicacion): Observable<Publicacion> {
    return this.http.post<Publicacion>(`${this.baseUrl}/publicaciones`, publicacion);
  }

  update(publicacion: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/publicaciones`, publicacion);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/publicaciones/${id}`);
  }
}
