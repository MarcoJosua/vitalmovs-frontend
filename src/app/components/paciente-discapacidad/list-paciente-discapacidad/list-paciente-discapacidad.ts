import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { PacienteDiscapacidad } from '../../../models/pacientediscapacidadDTO';
import { PacienteDiscapacidadService } from '../../../services/paciente-discapacidad-services';
import { TipoDiscapacidadService } from '../../../services/tipo-discapacidad-services';
import { TipoDiscapacidad } from '../../../models/tipodiscapacidadDTO';

interface FilaPacienteDiscapacidad extends PacienteDiscapacidad {
  nombreTipo?: string;
  descripcionTipo?: string;
}

@Component({
  selector: 'app-list-paciente-discapacidad',
  templateUrl: './list-paciente-discapacidad.html',
  standalone: false,
  styleUrls: ['./list-paciente-discapacidad.css']
})
export class ListPacienteDiscapacidadComponent implements OnInit {

  pacienteId!: number;
  discapacidades: FilaPacienteDiscapacidad[] = [];
  cargando: boolean = false;

  constructor(
    private pacienteDiscapacidadService: PacienteDiscapacidadService,
    private tipoDiscapacidadService: TipoDiscapacidadService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.pacienteId = Number(
      this.route.snapshot.paramMap.get('pacienteId') ||
      this.route.snapshot.paramMap.get('id')
    );

    console.log('Paciente ID recibido:', this.pacienteId);

    this.cargar();
  }

  cargar(): void {
    if (!this.pacienteId) {
      console.error('No se recibió pacienteId');
      return;
    }

    this.cargando = true;
    this.cdr.detectChanges();

    forkJoin({
      asignados: this.pacienteDiscapacidadService.findByPacienteId(this.pacienteId),
      tipos: this.tipoDiscapacidadService.listAll()
    }).subscribe({
      next: ({ asignados, tipos }) => {
        this.discapacidades = asignados.map(d => {
          const tipo = tipos.find((t: TipoDiscapacidad) => t.id === d.tipoDiscapacidadId);

          return {
            ...d,
            nombreTipo: tipo ? tipo.nombre : 'Tipo no encontrado',
            descripcionTipo: tipo ? tipo.descripcion : ''
          };
        });

        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar discapacidades del paciente', err);
        this.discapacidades = [];
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  agregar(): void {
    this.router.navigate(['/paciente', this.pacienteId, 'discapacidad', 'agregar']);
  }

  eliminar(id: number): void {
    if (confirm('¿Eliminar esta discapacidad del paciente?')) {
      this.pacienteDiscapacidadService.delete(id).subscribe({
        next: () => this.cargar(),
        error: (err) => console.error('Error al eliminar', err)
      });
    }
  }

  volver(): void {
    this.router.navigate(['/paciente/list-pacientes']);
  }
}