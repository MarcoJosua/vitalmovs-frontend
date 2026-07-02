import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Paciente } from '../../../models/pacienteDTO';
import { PacienteService } from '../../../services/paciente-service';

@Component({
  selector: 'app-list-paciente',
  templateUrl: './list-paciente.html',
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

  buscar(event: Event): void {
    const texto = (event.target as HTMLInputElement).value.trim();
    if (texto === '') {
      this.cargarPacientes();
    } else {
      this.pacienteService.buscarPorNombre(texto).subscribe({
        next: (data) => this.pacientes = data,
        error: (err) => console.error('Error al buscar', err)
      });
    }
  }

  verDiscapacidades(id: number): void {
    this.router.navigate(['/pacientes', id, 'discapacidades']);
  }
}
