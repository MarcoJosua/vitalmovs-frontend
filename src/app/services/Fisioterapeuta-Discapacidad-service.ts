import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FisioterapeutaDiscapacidad } from '../models/fisioterapeuta-discapacidad.model';

@Injectable({
  providedIn: 'root'
})
export class FisioterapeutaDiscapacidadService {

  private baseUrl = 'http://localhost:8080/vitalmovs';

  constructor(private http: HttpClient) {}

  findByFisioterapeutaId(fisioterapeutaId: number): Observable<FisioterapeutaDiscapacidad[]> {
    return this.http.get<FisioterapeutaDiscapacidad[]>(
      `${this.baseUrl}/fisioterapeutaDiscapacidad/fisioterapeuta/${fisioterapeutaId}`
    );
  }

  add(dto: FisioterapeutaDiscapacidad): Observable<FisioterapeutaDiscapacidad> {
    return this.http.post<FisioterapeutaDiscapacidad>(
      `${this.baseUrl}/fisioterapeutaDiscapacidad`, dto
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/fisioterapeutaDiscapacidad/${id}`);
  }
}
