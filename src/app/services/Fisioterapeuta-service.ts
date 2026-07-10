import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Fisioterapeuta } from '../models/FisioterapeutaDTO';


@Injectable({
  providedIn: 'root'
})
export class FisioterapeutaService {

  private baseUrl = 'http://localhost:8080/vitalmovs';

  constructor(private http: HttpClient) {}

  listAll(): Observable<Fisioterapeuta[]> {
    return this.http.get<Fisioterapeuta[]>(`${this.baseUrl}/fisioterapeuta/fisioterapeutas`);
  }

  add(fisioterapeuta: Fisioterapeuta): Observable<Fisioterapeuta> {
    return this.http.post<Fisioterapeuta>(`${this.baseUrl}/fisioterapeuta`, fisioterapeuta);
  }

  update(fisioterapeuta: Fisioterapeuta): Observable<Fisioterapeuta> {
    return this.http.put<Fisioterapeuta>(`${this.baseUrl}/fisioterapeuta`, fisioterapeuta);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/fisioterapeuta/${id}`);
  }

  buscarPorNombreOApellido(texto: string): Observable<Fisioterapeuta[]> {
    const params = new HttpParams().set('texto', texto);
    return this.http.get<Fisioterapeuta[]>(`${this.baseUrl}/fisioterapeuta/buscar`, { params });
  }

  findByEspecialidad(especialidad: string): Observable<Fisioterapeuta[]> {
    const params = new HttpParams().set('especialidad', especialidad);
    return this.http.get<Fisioterapeuta[]>(`${this.baseUrl}/fisioterapeuta/especialidad`, { params });
  }
  
  findCompatiblesByPacienteId(pacienteId: number): Observable<Fisioterapeuta[]> {
    return this.http.get<Fisioterapeuta[]>(`${this.baseUrl}/fisioterapeuta/compatibles/paciente/${pacienteId}`);
  }

  findByUserId(userId: number) {
      return this.http.get<Fisioterapeuta>(`${this.baseUrl}/fisioterapeuta/user/${userId}`
    );
  }
}
