import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { EstadisticaDTO } from '../../../models/EstadisticaDTO';
import { EstadisticaService } from '../../../services/estadistica-service';

import { PlanRehabilitacionDTO } from '../../../models/PlanRehabilitacionDTO';
import { PlanRehabilitacionService } from '../../../services/plan-rehabilitacion-service';

import { PlanEjercicioDTO } from '../../../models/PlanEjercicioDTO';
import { PlanEjercicioService } from '../../../services/plan-ejercicio-service';

@Component({
  selector: 'app-add-estadistica',
  standalone: false,
  templateUrl: './add-estadistica.html',
  styleUrl: './add-estadistica.css',
})
export class AddEstadistica implements OnInit {

  estadisticaForm!: FormGroup;
  planId: number = 0;
  planEjercicioId: number = 0;
  estadisticaId: number = 0;
  modoEdicion: boolean = false;
  plan!: PlanRehabilitacionDTO;
  planEjercicio!: PlanEjercicioDTO;
  listaEstadisticas: EstadisticaDTO[] = [];
  fechaHoy: Date = new Date();
  fechaMinima!: Date;
  fechaMaxima!: Date;

  constructor(
    private formBuilder: FormBuilder,
    private estadisticaService: EstadisticaService,
    private planRehabilitacionService: PlanRehabilitacionService,
    private planEjercicioService: PlanEjercicioService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.planId = Number(this.activatedRoute.snapshot.paramMap.get('planId'));
    this.planEjercicioId = Number(this.activatedRoute.snapshot.paramMap.get('planEjercicioId'));

    const estadisticaIdParam = this.activatedRoute.snapshot.paramMap.get('estadisticaId');

    if (estadisticaIdParam != null) {
      this.modoEdicion = true;
      this.estadisticaId = Number(estadisticaIdParam);
    }

    this.estadisticaForm = this.formBuilder.group({
      id: [0],
      fecha: [this.fechaHoy, Validators.required],
      nivelDolor: ['', [Validators.required, Validators.min(0), Validators.max(10)]],
      nivelDificultad: ['', [Validators.required, Validators.min(0), Validators.max(10)]],
      repeticionesRealizadas: ['', [Validators.required, Validators.min(0)]],
      duracionRealizada: ['', [Validators.required, Validators.min(0)]],
      observacion: ['', Validators.required],
      planEjercicioId: [this.planEjercicioId]
    });

    this.CargarPlan();
    this.CargarPlanEjercicio();
    this.CargarEstadisticasDelEjercicio();

    if (this.modoEdicion) {
      this.cargarEstadistica();
    }
  }

  CargarPlan(): void {
    this.planRehabilitacionService.getById(this.planId).subscribe({
      next: (data: PlanRehabilitacionDTO) => {
        this.plan = data;

        this.fechaMinima = this.crearFechaLocal(this.plan.fecha_inicio);

        const fechaFinPlan = this.crearFechaLocal(this.plan.fecha_fin);
        const hoy = this.limpiarHora(new Date());

        if (fechaFinPlan < hoy) {
          this.fechaMaxima = fechaFinPlan;
        } else {
          this.fechaMaxima = hoy;
        }

        if (!this.modoEdicion) {
          this.estadisticaForm.get('fecha')?.setValue(this.obtenerFechaInicial());
        }
      },
      error: (err) => {
      }
    });
  }

  CargarPlanEjercicio(): void {
    this.planEjercicioService.findByPlanIdOrdenado(this.planId).subscribe({
      next: (data: PlanEjercicioDTO[]) => {
        const encontrado = data.find(e => e.id === this.planEjercicioId);

        if (encontrado) {
          this.planEjercicio = encontrado;
        }
      },
      error: (err) => {
      }
    });
  }

  CargarEstadisticasDelEjercicio(): void {
    this.estadisticaService.listByPlanEjercicioId(this.planEjercicioId).subscribe({
      next: (data: EstadisticaDTO[]) => {
        this.listaEstadisticas = data;
      },
      error: (err) => {
      }
    });
  }

  cargarEstadistica(): void {
    this.estadisticaService.getById(this.estadisticaId).subscribe({
      next: (data: EstadisticaDTO) => {
        this.estadisticaForm.get('id')?.setValue(data.id);
        this.estadisticaForm.get('fecha')?.setValue(this.crearFechaLocal(data.fecha));
        this.estadisticaForm.get('nivelDolor')?.setValue(data.nivelDolor);
        this.estadisticaForm.get('nivelDificultad')?.setValue(data.nivelDificultad);
        this.estadisticaForm.get('repeticionesRealizadas')?.setValue(data.repeticionesRealizadas);
        this.estadisticaForm.get('duracionRealizada')?.setValue(data.duracionRealizada);
        this.estadisticaForm.get('observacion')?.setValue(data.observacion);
        this.estadisticaForm.get('planEjercicioId')?.setValue(data.planEjercicioId);
      },
      error: (err) => {
      }
    });
  }

  obtenerFechaInicial(): Date {
    const hoy = this.limpiarHora(new Date());

    if (this.fechaMinima && hoy < this.fechaMinima) {
      return this.fechaMinima;
    }

    if (this.fechaMaxima && hoy > this.fechaMaxima) {
      return this.fechaMaxima;
    }

    return hoy;
  }

  crearFechaLocal(fecha: string): Date {
    return new Date(fecha + 'T00:00:00');
  }

  limpiarHora(fecha: Date): Date {
    const nuevaFecha = new Date(fecha);
    nuevaFecha.setHours(0, 0, 0, 0);
    return nuevaFecha;
  }

  convertirFecha(fecha: Date): string {
    const anio = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');
    return `${anio}-${mes}-${dia}`;
  }

  obtenerDiaSemana(fecha: Date): string {
    const dias = [
      'DOMINGO',
      'LUNES',
      'MARTES',
      'MIERCOLES',
      'JUEVES',
      'VIERNES',
      'SABADO'
    ];
    return dias[fecha.getDay()];
  }

  existeEstadisticaMismaFecha(fechaTexto: string): boolean {
    return this.listaEstadisticas.some(e =>
      e.fecha === fechaTexto &&
      e.id !== this.estadisticaId
    );
  }

  validarFechaSeleccionada(fechaSeleccionada: Date): boolean {
    const fecha = this.limpiarHora(fechaSeleccionada);
    const hoy = this.limpiarHora(new Date());

    if (fecha > hoy) {
      this.snackBar.open('La fecha no puede ser futura', 'Cerrar', {
        duration: 3000
      });
      return false;
    }

    if (this.fechaMinima && fecha < this.fechaMinima) {
      this.snackBar.open('La fecha debe estar dentro del rango del plan', 'Cerrar', {
        duration: 3000
      });
      return false;
    }

    if (this.fechaMaxima && fecha > this.fechaMaxima) {
      this.snackBar.open('La fecha debe estar dentro del rango del plan', 'Cerrar', {
        duration: 3000
      });
      return false;
    }

    if (!this.planEjercicio) {
      this.snackBar.open('No se pudo validar el ejercicio del plan', 'Cerrar', {
        duration: 3000
      });
      return false;
    }

    const diaFecha = this.obtenerDiaSemana(fecha);

    if (diaFecha !== this.planEjercicio.diaSemana) {
      this.snackBar.open('La fecha seleccionada no coincide con el día del ejercicio', 'Cerrar', {
        duration: 3000
      });
      return false;
    }

    const fechaTexto = this.convertirFecha(fecha);

    if (this.existeEstadisticaMismaFecha(fechaTexto)) {
      this.snackBar.open('Ya existe un progreso registrado para este ejercicio en esa fecha', 'Cerrar', {
        duration: 3000
      });
      return false;
    }

    return true;
  }

  Grabar(): void {
    if (this.estadisticaForm.invalid) {
      this.snackBar.open('Complete todos los campos correctamente', 'Cerrar', {
        duration: 3000
      });
      return;
    }

    const fechaSeleccionada: Date = this.estadisticaForm.get('fecha')?.value;

    if (!this.validarFechaSeleccionada(fechaSeleccionada)) {
      return;
    }

    const observacion = this.estadisticaForm.get('observacion')?.value;

    if (observacion == null || observacion.trim() === '') {
      this.snackBar.open('La observación no puede estar vacía', 'Cerrar', {
        duration: 3000
      });
      return;
    }

    const estadisticaDTO: EstadisticaDTO = {
      id: this.modoEdicion ? this.estadisticaId : 0,
      fecha: this.convertirFecha(fechaSeleccionada),
      nivelDolor: Number(this.estadisticaForm.get('nivelDolor')?.value),
      nivelDificultad: Number(this.estadisticaForm.get('nivelDificultad')?.value),
      repeticionesRealizadas: Number(this.estadisticaForm.get('repeticionesRealizadas')?.value),
      duracionRealizada: Number(this.estadisticaForm.get('duracionRealizada')?.value),
      observacion: observacion.trim(),
      planEjercicioId: this.planEjercicioId
    };

    if (this.modoEdicion) {
      this.estadisticaService.update(estadisticaDTO).subscribe({
        next: () => {
          this.snackBar.open('Progreso actualizado correctamente', 'Cerrar', {
            duration: 3000
          });

          this.router.navigate(['/plan-rehabilitacion', this.planId, 'plan-ejercicio']);
        },
        error: (err) => {
        }
      });
    } else {
      this.estadisticaService.add(estadisticaDTO).subscribe({
        next: () => {
          this.snackBar.open('Progreso registrado correctamente', 'Cerrar', {
            duration: 3000
          });

          this.router.navigate(['/plan-rehabilitacion', this.planId, 'plan-ejercicio']);
        },
        error: (err) => {
        }
      });
    }
  }

  cancelar(): void {
    this.router.navigate(['/plan-rehabilitacion', this.planId, 'plan-ejercicio']);
  }
}