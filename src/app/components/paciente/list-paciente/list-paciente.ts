import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PacienteService } from '../../../services/paciente-services';
import { Paciente } from '../../../models/pacienteDTO';


@Component({
  selector: 'app-list-paciente',
  templateUrl: './list-paciente.html',
  standalone: false,
  styleUrls: ['./list-paciente.css']
})
export class ListPacienteComponent implements OnInit {
  pacientes: Paciente[] = [];
  columnas: string[] = ['id', 'nombre', 'apellido', 'edad', 'sexo', 'acciones'];

  constructor(
    private pacienteService: PacienteService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarPacientes();
  }

  cargarPacientes(): void {
    this.pacienteService.listAll().subscribe({
      next: (data) => this.pacientes = data,
      error: (err) => console.error('Error al cargar pacientes', err)
    });
  }

  editar(id: number): void {
    this.router.navigate(['/pacientes/editar', id]);
  }

  verDiscapacidades(id: number): void {
    this.router.navigate(['/pacientes', id, 'discapacidades']);
  }

  eliminar(id: number): void {
    if (confirm('¿Seguro que deseas eliminar este paciente?')) {
      this.pacienteService.delete(id).subscribe({
        next: () => this.cargarPacientes(),
        error: (err) => console.error('Error al eliminar', err)
      });
    }
  }

  nuevo(): void {
    this.router.navigate(['/pacientes/nuevo']);
  }
}
