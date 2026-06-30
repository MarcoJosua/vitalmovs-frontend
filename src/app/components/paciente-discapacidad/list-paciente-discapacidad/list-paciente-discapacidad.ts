import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { PacienteDiscapacidad } from '../../../models/pacientediscapacidadDTO';
import { PacienteDiscapacidadService } from '../../../services/paciente-discapacidad-services';
import { TipoDiscapacidadService } from '../../../services/tipo-discapacidad-services';
import { TipoDiscapacidad } from '../../../models/tipodiscapacidadDTO';


interface FilaDiscapacidad extends PacienteDiscapacidad {
  nombreTipo?: string;
}

@Component({
  selector: 'app-list-paciente-discapacidad',
  templateUrl: './list-paciente-discapacidad.html',
  standalone: false,
  styleUrls: ['./list-paciente-discapacidad.css']
})
export class ListPacienteDiscapacidadComponent implements OnInit {
  pacienteId!: number;
  filas: FilaDiscapacidad[] = [];
  columnas: string[] = ['nombreTipo', 'acciones'];

  constructor(
    private pacienteDiscapacidadService: PacienteDiscapacidadService,
    private tipoDiscapacidadService: TipoDiscapacidadService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.pacienteId = Number(this.route.snapshot.paramMap.get('id'));
    this.cargar();
  }

  cargar(): void {
    forkJoin({
      asignados: this.pacienteDiscapacidadService.findByPacienteId(this.pacienteId),
      tipos: this.tipoDiscapacidadService.listAll()
    }).subscribe({
      next: ({ asignados, tipos }) => {
        this.filas = asignados.map(a => ({
          ...a,
          nombreTipo: tipos.find((t: TipoDiscapacidad) => t.id === a.tipoDiscapacidadId)?.nombre
        }));
      },
      error: (err) => console.error('Error al cargar discapacidades', err)
    });
  }

  quitar(id: number): void {
    if (confirm('¿Quitar esta discapacidad del paciente?')) {
      this.pacienteDiscapacidadService.delete(id).subscribe({
        next: () => this.cargar(),
        error: (err) => console.error('Error al quitar', err)
      });
    }
  }

  agregar(): void {
    this.router.navigate(['/pacientes', this.pacienteId, 'discapacidades']);
  }
}
