import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { TipoDiscapacidad } from '../../../models/tipo-discapacidad';
import { TipoDiscapacidadService } from '../../../services/tipo-discapacidad.service';
import { PacienteDiscapacidadService } from '../../../services/paciente-discapacidad.service';

interface OpcionDiscapacidad {
  tipo: TipoDiscapacidad;
  marcado: boolean;
  registroId: number | null; // id de la fila en paciente_discapacidad, si ya existe
}

@Component({
  selector: 'app-add-paciente-discapacidad',
  templateUrl: './add-paciente-discapacidad.html',
  styleUrls: ['./add-paciente-discapacidad.css']
})
export class AddPacienteDiscapacidadComponent implements OnInit {
  pacienteId!: number;
  opciones: OpcionDiscapacidad[] = [];

  constructor(
    private tipoDiscapacidadService: TipoDiscapacidadService,
    private pacienteDiscapacidadService: PacienteDiscapacidadService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.pacienteId = Number(this.route.snapshot.paramMap.get('id'));

    forkJoin({
      tipos: this.tipoDiscapacidadService.listAll(),
      asignados: this.pacienteDiscapacidadService.findByPacienteId(this.pacienteId)
    }).subscribe({
      next: ({ tipos, asignados }) => {
        this.opciones = tipos.map(tipo => {
          const encontrado = asignados.find(a => a.tipoDiscapacidadId === tipo.id);
          return {
            tipo,
            marcado: !!encontrado,
            registroId: encontrado ? encontrado.id! : null
          };
        });
      },
      error: (err) => console.error('Error al cargar discapacidades', err)
    });
  }

  guardar(): void {
    const operaciones = [];

    for (const opcion of this.opciones) {
      const yaExiste = opcion.registroId !== null;

      if (opcion.marcado && !yaExiste) {
        operaciones.push(this.pacienteDiscapacidadService.add({
          tipoDiscapacidadId: opcion.tipo.id!,
          pacienteId: this.pacienteId
        }));
      }

      if (!opcion.marcado && yaExiste) {
        operaciones.push(this.pacienteDiscapacidadService.delete(opcion.registroId!));
      }
    }

    if (operaciones.length === 0) {
      this.router.navigate(['/pacientes']);
      return;
    }

    forkJoin(operaciones).subscribe({
      next: () => this.router.navigate(['/pacientes']),
      error: (err) => console.error('Error al guardar discapacidades', err)
    });
  }

  cancelar(): void {
    this.router.navigate(['/pacientes']);
  }
}
