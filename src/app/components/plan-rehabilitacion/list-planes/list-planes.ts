import { Component, ChangeDetectorRef } from '@angular/core';
import { Observable, of } from 'rxjs';
import { PlanRehabilitacionDTO } from '../../../models/PlanRehabilitacionDTO';
import { AsignacionDTO } from '../../../models/AsignacionDTO';
import { PlanRehabilitacionService } from '../../../services/plan-rehabilitacion-service';
import { AsignacionService } from '../../../services/asignacion-service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../../services/user-service';

@Component({
  selector: 'app-list-planes',
  standalone: false,
  templateUrl: './list-planes.html',
  styleUrl: './list-planes.css',
})
export class ListPlanes {

  planes: PlanRehabilitacionDTO[] = [];
  asignaciones: AsignacionDTO[] = [];
  asignacionesAceptadasSinPlan: AsignacionDTO[] = [];

  rol: string = '';
  userId: number = 0;
  // Paciente 1 -> userId 2
  // Paciente 2 -> userId 3 
  // Paciente 3 -> userId 4
  // Fisio 1 -> userId 5 
  // Fisio 2 -> userId 6 
  // Fisio 3 -> userId 7 

  constructor(
    private planRehabilitacionService: PlanRehabilitacionService,
    private asignacionService: AsignacionService,
    private userService: UserService,
    private router: Router,
    private snackBar: MatSnackBar, private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.userId = this.userService.getIdLogeado();
    this.rol = this.userService.getAuthoritiesLogeado();

    console.log('USER ID LOGUEADO:', this.userId);
    console.log('ROL LOGUEADO:', this.rol);

    (window as any).listPlanes = this;
    this.CargaLista();
  }

  CargaLista(): void {
    this.planRehabilitacionService.findByUserId(this.userId).subscribe({
      next: (data: PlanRehabilitacionDTO[]) => {
        this.planes = data;
        this.agregarNombresAPlanes();
        this.finalizarPlan();
        this.cdr.detectChanges();
      },
      error: (err: any) => {
      }
    });

    if (this.rol === 'ROLE_FISIOTERAPEUTA') {
      this.asignacionService.findByFisioterapeutaId(this.userId).subscribe({
        next: (data: AsignacionDTO[]) => {
          this.asignaciones = data;
          this.asignacionesAceptadasSinPlan = data.filter(a => a.estado === 'ACEPTADO' &&a.planRehabilitacionId == null);
          this.agregarNombresAPlanes();
          this.cdr.detectChanges();
        },
        error: (err: any) => {
        }
      });
    }

    if (this.rol === 'ROLE_PACIENTE') {
      this.asignacionService.findByPacienteId(this.userId).subscribe({
        next: (data: AsignacionDTO[]) => {
          this.asignaciones = data;
          this.agregarNombresAPlanes();
          this.cdr.detectChanges();
        },
        error: (err: any) => {
        }
      });
    }
  }

  agregarNombresAPlanes(): void {
    if (this.planes.length === 0 || this.asignaciones.length === 0) {
      return;
    }

    this.planes = this.planes.map(plan => {
      const asignacion = this.asignaciones.find(a =>
        a.id === plan.asignacionId ||
        a.planRehabilitacionId === plan.id
      );

      return {
        ...plan,
        nombrePaciente: asignacion?.nombrePaciente,
        nombreFisioterapeuta: asignacion?.nombreFisioterapeuta,
        apellidoPaciente: asignacion?.apellidoPaciente,
        apellidoFisioterapeuta: asignacion?.apellidoFisioterapeuta
      };
    });
  }




  crearPlan(asignacionId: number): void {
    this.router.navigate(['/plan-rehabilitacion/agregar', asignacionId]);
  }

  verRutina(planId: number): void {
    this.router.navigate(['/plan-rehabilitacion', planId, 'plan-ejercicio']);
  }

  verEstadisticas(planId: number): void {
    this.router.navigate(['/plan-rehabilitacion', planId, 'estadistica']);
  }

  editarPlan(planId: number): void {
  this.router.navigate(['/plan-rehabilitacion/editar', planId]);
  }

  cancelarPlan(plan: PlanRehabilitacionDTO): void {

    const planActualizado: PlanRehabilitacionDTO = {
      id: plan.id,
      nombre: plan.nombre,
      descripcion: plan.descripcion,
      fecha_inicio: plan.fecha_inicio,
      fecha_fin: plan.fecha_fin,
      estado: 'CANCELADO',
      asignacionId: plan.asignacionId
    };

    this.planRehabilitacionService.update(planActualizado).subscribe({
      next: () => {
        this.snackBar.open('Plan Cancelado correctamente', 'Cerrar', {
          duration: 3000
        });

        this.CargaLista();
      },
      error: (error) => {
      }
    });
  }

  finalizarPlan(): void {
  const fechaHoy = new Date();
  fechaHoy.setHours(0, 0, 0, 0);

  for (let plan of this.planes) {
    const fechaFin = new Date(plan.fecha_fin);
    fechaFin.setHours(0, 0, 0, 0);

    if (plan.estado === 'ACTIVO' && fechaFin <= fechaHoy) {
      const planFinalizado: PlanRehabilitacionDTO = {
        id: plan.id,
        nombre: plan.nombre,
        descripcion: plan.descripcion,
        fecha_inicio: plan.fecha_inicio,
        fecha_fin: plan.fecha_fin,
        estado: 'FINALIZADO',
        asignacionId: plan.asignacionId
      };

      this.planRehabilitacionService.update(planFinalizado).subscribe({
        next: () => {
          plan.estado = 'FINALIZADO';
          this.cdr.detectChanges();
        },
        error: (err) => {
        }
      });
    }
  }
}









}