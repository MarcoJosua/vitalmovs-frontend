import { Component, OnInit , ChangeDetectorRef} from '@angular/core';

import { UserService } from '../../services/user-service';

import { FisioterapeutaDiscapacidadService } from '../../services/Fisioterapeuta-Discapacidad-service';

import { PacienteDiscapacidad } from '../../models/pacientediscapacidadDTO';
import { FisioterapeutaDiscapacidad } from '../../models/FisioterapeutaDiscapacidadDTO';
import { Paciente } from '../../models/pacienteDTO';
import { Fisioterapeuta } from '../../models/FisioterapeutaDTO';
import { PacienteService } from '../../services/paciente-services';
import { FisioterapeutaService } from '../../services/Fisioterapeuta-service';
import { PacienteDiscapacidadService } from '../../services/paciente-discapacidad-services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {

  rol: string = '';
  userId: number = 0;

  paciente: Paciente | null = null;
  fisioterapeuta: Fisioterapeuta | null = null;

  discapacidadesPaciente: string = '';
  discapacidadesFisioterapeuta: string = '';

  totalPacientes: number = 0;
  totalFisioterapeutas: number = 0;

  constructor(
    private userService: UserService,
    private pacienteService: PacienteService,
    private fisioterapeutaService: FisioterapeutaService,
    private pacienteDiscapacidadService: PacienteDiscapacidadService,
    private fisioterapeutaDiscapacidadService: FisioterapeutaDiscapacidadService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.rol = this.userService.getAuthoritiesLogeado().trim();
    this.userId = Number(this.userService.getIdLogeado());

    if (this.rol === 'ROLE_PACIENTE') {
      this.cargarDatosPaciente();
    }

    if (this.rol === 'ROLE_FISIOTERAPEUTA') {
      this.cargarDatosFisioterapeuta();
    }

    if (this.rol === 'ROLE_ADMIN') {
      this.cargarResumenAdmin();
    }
  }

 cargarDatosPaciente(): void {
  this.pacienteService.findByUserId(this.userId).subscribe({
    next: (data: Paciente) => {
      this.paciente = data;

      if (data.id == null) {
        console.log('El paciente no tiene id');
        return;
      }

      this.pacienteDiscapacidadService.findByPacienteId(data.id).subscribe({
        next: (lista: PacienteDiscapacidad[]) => {
          this.discapacidadesPaciente = lista
            .map(d => d.tipoDiscapacidadNombre)
            .filter(nombre => nombre != null && nombre !== '')
            .join(', ');

          this.cdr.detectChanges();
        },
        error: (err: any) => {
          console.log('Error al cargar discapacidades del paciente:', err);
        }
      });
    },
    error: (err: any) => {
      console.log('Error al cargar datos del paciente:', err);
    }
  });
}

  cargarDatosFisioterapeuta(): void {
  this.fisioterapeutaService.findByUserId(this.userId).subscribe({
    next: (data: Fisioterapeuta) => {
      this.fisioterapeuta = data;

      if (data.id == null) {
        console.log('El fisioterapeuta no tiene id');
        return;
      }

      this.fisioterapeutaDiscapacidadService.findByFisioterapeutaId(data.id).subscribe({
        next: (lista: FisioterapeutaDiscapacidad[]) => {
          this.discapacidadesFisioterapeuta = lista
            .map(d => d.tipoDiscapacidadNombre)
            .filter(nombre => nombre != null && nombre !== '')
            .join(', ');

            this.cdr.detectChanges();
        },
        error: (err: any) => {
          console.log('Error al cargar discapacidades del fisioterapeuta:', err);
        }
      });
    },
    error: (err: any) => {
      console.log('Error al cargar datos del fisioterapeuta:', err);
    }
  });
}

  cargarResumenAdmin(): void {
    console.log('Cargando resumen admin...');

    this.pacienteService.listAll().subscribe({
      next: (data: Paciente[]) => {
        console.log('Pacientes recibidos:', data);

        this.totalPacientes = data.length;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.log('Error al cargar pacientes:', err);
      }
    });

    this.fisioterapeutaService.listAll().subscribe({
      next: (data: Fisioterapeuta[]) => {
        console.log('Fisioterapeutas recibidos:', data);

        this.totalFisioterapeutas = data.length;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.log('Error al cargar fisioterapeutas:', err);
      }
    });
  }
  
  registrarDiscapacidadPaciente(): void {
    if (this.paciente && this.paciente.id) {
      this.router.navigate(['/paciente', this.paciente.id, 'discapacidad', 'agregar', 'perfil']);
    }
  }

  registrarDiscapacidadFisioterapeuta(): void {
    if (this.fisioterapeuta && this.fisioterapeuta.id) {
     this.router.navigate(['/fisioterapeuta', this.fisioterapeuta.id, 'discapacidad', 'agregar', 'perfil']);
    }
  }

  obtenerNombreRol(): string {
    if (this.rol === 'ROLE_PACIENTE') {
      return 'Paciente';
    }

    if (this.rol === 'ROLE_FISIOTERAPEUTA') {
      return 'Fisioterapeuta';
    }

    if (this.rol === 'ROLE_ADMIN') {
      return 'Administrador';
    }

    return 'Usuario';
  }
}