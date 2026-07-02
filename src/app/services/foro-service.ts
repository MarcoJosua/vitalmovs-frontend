import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Foro } from '../models/ForoDTO';
import { ForoVista } from '../models/ForoVistaDTO';

@Injectable({
  providedIn: 'root'
})
export class ForoService {

  private baseUrl = 'http://localhost:8080/vitalmovs';

  constructor(private http: HttpClient) {}

  listAll(): Observable<Foro[]> {
    return this.http.get<Foro[]>(`${this.baseUrl}/foros`);
  }

  listByPacienteId(pacienteId: number): Observable<ForoVista[]> {
    return this.http.get<ForoVista[]>(`${this.baseUrl}/foros/${pacienteId}`);
  }

  add(foro: Foro): Observable<Foro> {
    return this.http.post<Foro>(`${this.baseUrl}/foros`, foro);
  }

  update(foro: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/foros`, foro);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/foros/${id}`);
  }
}
