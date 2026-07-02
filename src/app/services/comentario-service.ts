import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comentario } from '../models/ComentarioDTO';

@Injectable({
  providedIn: 'root'
})
export class ComentarioService {

  private baseUrl = 'http://localhost:8080/vitalmovs';

  constructor(private http: HttpClient) {}

  listByPublicacionId(publicacionId: number): Observable<Comentario[]> {
    return this.http.get<Comentario[]>(`${this.baseUrl}/comentarios/${publicacionId}`);
  }

  add(comentario: Comentario): Observable<Comentario> {
    return this.http.post<Comentario>(`${this.baseUrl}/comentarios`, comentario);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/comentarios/${id}`);
  }
}
