import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FisioterapeutaDiscapacidad } from '../../models/fisioterapeuta-discapacidad.model';
import { FisioterapeutaDiscapacidadService } from '../../services/fisioterapeuta-discapacidad.service';

interface TipoDiscapacidad {
  id: number;
  nombre: string;
  descripcion: string;
}

@Component({
  selector: 'app-add-fisio-discapacidad',
  templateUrl: './add-fisio-discapacidad.html',
  styleUrls: ['./add-fisio-discapacidad.css']
})
export class AddFisioDiscapacidadComponent implements OnInit {

  fisioterapeutaId!: number;
  tiposDiscapacidad: TipoDiscapacidad[] = [];
  tipoSeleccionadoId: number = 0;

  constructor(
    private fdService: FisioterapeutaDiscapacidadService,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.fisioterapeutaId = Number(this.route.snapshot.paramMap.get('id'));
    this.http.get<TipoDiscapacidad[]>('http://localhost:8080/vitalmovs/tipoDiscapacidad/tipos')
      .subscribe({
        next: (data) => this.tiposDiscapacidad = data,
        error: (err) => console.error('Error al cargar tipos de discapacidad', err)
      });
  }
  
  guardar(): void {
  if (!this.tipoSeleccionadoId) return;
  const dto: FisioterapeutaDiscapacidad = {
    fisioterapeutaId: this.fisioterapeutaId,
    tipoDiscapacidadId: this.tipoSeleccionadoId
  };
  this.fdService.add(dto).subscribe({
    next: () => this.router.navigate(['/fisioterapeuta', this.fisioterapeutaId, 'discapacidad']),
    error: (err) => console.error('Error al guardar', err)
  });
}
cancelar(): void {
  this.router.navigate(['/fisioterapeuta', this.fisioterapeutaId, 'discapacidad']);
}
}
