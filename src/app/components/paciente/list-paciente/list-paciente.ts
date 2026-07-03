import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Paciente } from '../../../models/pacienteDTO';
import { PacienteService } from '../../../services/paciente-services';

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
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarPacientes();
  }

  cargarPacientes(): void {
    this.pacienteService.listAll().subscribe({
      next: (data) => {
        this.pacientes = [...data];
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar pacientes', err);
        this.pacientes = [];
        this.cdr.detectChanges();
      }
    });
  }

  buscar(event: Event): void {
    const texto = (event.target as HTMLInputElement).value.trim();

    if (texto === '') {
      this.cargarPacientes();
      return;
    }

    this.pacienteService.buscarPorNombre(texto).subscribe({
      next: (data) => {
        this.pacientes = [...data];
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al buscar pacientes', err);
        this.pacientes = [];
        this.cdr.detectChanges();
      }
    });
  }

  verDiscapacidades(id: number): void {
    this.router.navigate(['/paciente', id, 'discapacidad']);
  }
}