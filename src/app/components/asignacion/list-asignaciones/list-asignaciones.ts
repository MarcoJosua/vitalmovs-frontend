import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AsignacionDTO } from '../../../models/AsignacionDTO';
import { Fisioterapeuta } from '../../../models/FisioterapeutaDTO';
import { Paciente } from '../../../models/pacienteDTO';
import { AsignacionService } from '../../../services/asignacion-service';
import { FisioterapeutaService } from '../../../services/Fisioterapeuta-service';
import { PacienteService } from '../../../services/paciente-services';
import { UserService } from '../../../services/user-service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-list-asignaciones',
  standalone: false,
  templateUrl: './list-asignaciones.html',
  styleUrl: './list-asignaciones.css',
})
export class ListAsignaciones implements OnInit {

  rol: string = '';
  userId: number = 0;

  paciente: Paciente | null = null;

  fisioterapeutasCompatibles: Fisioterapeuta[] = [];
  asignacionesPaciente: AsignacionDTO[] = [];
  asignacionesFisioterapeuta: AsignacionDTO[] = [];

  mensajeSolicitud: string = 'Solicito una asignación para iniciar mi tratamiento.';
  cargando: boolean = false;

  constructor(
    private asignacionService: AsignacionService,
    private fisioterapeutaService: FisioterapeutaService,
    private pacienteService: PacienteService,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.userId = this.userService.getIdLogeado();
    this.rol = this.userService.getAuthoritiesLogeado();

    this.cargarDatos();
  }

  cargarDatos(): void {
  this.rol = this.userService.getAuthoritiesLogeado();

  if (this.rol.includes('ROLE_PACIENTE')) {
    this.cargarVistaPaciente();
    return;
  }

  if (this.rol.includes('ROLE_FISIOTERAPEUTA')) {
    this.cargarVistaFisioterapeuta();
    return;
  }

  this.cargando = false;
  this.cdr.detectChanges();
}

  cargarVistaPaciente(): void {
    this.cargando = true;

    this.pacienteService.findByUserId(this.userId).subscribe({
      next: (paciente: Paciente) => {
        this.paciente = paciente;

        this.cargarAsignacionesPaciente();
        this.cargarFisioterapeutasCompatibles(paciente.id);
      },
      error: (err) => {
        console.error(err);
        this.cargando = false;
        this.snackBar.open('No se pudo cargar el paciente logueado', 'Cerrar', {
          duration: 3000
        });
      }
    });
  }

  cargarAsignacionesPaciente(): void {
  this.asignacionService.findByPacienteId(this.userId).subscribe({
    next: (data: AsignacionDTO[]) => {
      this.asignacionesPaciente = data;
      this.cdr.detectChanges();
    },
    error: (err) => {
      console.error(err);
      this.cdr.detectChanges();
    }
  });
}

  cargarFisioterapeutasCompatibles(pacienteId: number): void {
  this.fisioterapeutaService.findCompatiblesByPacienteId(pacienteId).subscribe({
    next: (data: Fisioterapeuta[]) => {
      this.fisioterapeutasCompatibles = data;
      this.cargando = false;
      this.cdr.detectChanges();
    },
    error: (err) => {
      console.error(err);
      this.cargando = false;
      this.snackBar.open('No se pudieron cargar los fisioterapeutas compatibles', 'Cerrar', {
        duration: 3000
      });
      this.cdr.detectChanges();
    }
  });
}

  cargarVistaFisioterapeuta(): void {
  this.cargando = true;
  this.cdr.detectChanges();

  this.asignacionService.findByFisioterapeutaId(this.userId).subscribe({
    next: (data: AsignacionDTO[]) => {
      this.asignacionesFisioterapeuta = data;
      this.cargando = false;
      this.cdr.detectChanges();
    },
    error: (err) => {
      console.error(err);
      this.cargando = false;
      this.snackBar.open('No se pudieron cargar las solicitudes', 'Cerrar', {
        duration: 3000
      });
      this.cdr.detectChanges();
    }
  });
}

  solicitarAsignacion(fisioterapeuta: Fisioterapeuta): void {
    if (!this.paciente || !fisioterapeuta.id) {
      this.snackBar.open('No se pudo identificar el paciente o fisioterapeuta', 'Cerrar', {
        duration: 3000
      });
      return;
    }

    if (this.yaSolicitado(fisioterapeuta.id)) {
      this.snackBar.open('Ya existe una solicitud para este fisioterapeuta', 'Cerrar', {
        duration: 3000
      });
      return;
    }

    const fechaHoy = new Date().toISOString().substring(0, 10);

    const nuevaAsignacion: AsignacionDTO = {
      id: 0,
      mensaje: this.mensajeSolicitud,
      fecha: fechaHoy,
      estado: 'PENDIENTE',
      pacienteId: this.paciente.id,
      fisioterapeutaId: fisioterapeuta.id,
      planRehabilitacionId: null,
      nombrePaciente: '',
      nombreFisioterapeuta: '',
      apellidoPaciente: '',
      apellidoFisioterapeuta: ''
    };

    this.asignacionService.add(nuevaAsignacion).subscribe({
      next: () => {
        this.snackBar.open('Solicitud enviada correctamente', 'Cerrar', {
          duration: 3000
        });
        this.cargarAsignacionesPaciente();
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open('No se pudo enviar la solicitud', 'Cerrar', {
          duration: 3000
        });
      }
    });
  }

  aceptarAsignacion(asignacion: AsignacionDTO): void {
    const asignacionActualizada: any = {
      id: asignacion.id,
      mensaje: asignacion.mensaje,
      fecha: asignacion.fecha,
      estado: 'ACEPTADO'
    };

    this.asignacionService.update(asignacionActualizada as AsignacionDTO).subscribe({
      next: () => {
        this.snackBar.open('Solicitud aceptada correctamente', 'Cerrar', {
          duration: 3000
        });
        this.cargarVistaFisioterapeuta();
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open('No se pudo aceptar la solicitud', 'Cerrar', {
          duration: 3000
        });
      }
    });
  }

  yaSolicitado(fisioterapeutaId: number): boolean {
    return this.asignacionesPaciente.some(a =>
      a.fisioterapeutaId === fisioterapeutaId &&
      (a.estado === 'PENDIENTE' || a.estado === 'ACEPTADO')
    );
  }

  obtenerEstadoSolicitud(fisioterapeutaId: number): string {
    const asignacion = this.asignacionesPaciente.find(a =>
      a.fisioterapeutaId === fisioterapeutaId &&
      (a.estado === 'PENDIENTE' || a.estado === 'ACEPTADO')
    );

    return asignacion ? asignacion.estado : '';
  }
}