import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { EstadisticaDTO } from '../../../models/EstadisticaDTO';
import { EstadisticaService } from '../../../services/estadistica-service';

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

  listaEstadisticas: EstadisticaDTO[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private estadisticaService: EstadisticaService,
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
      fecha: [this.obtenerFechaHoyTexto()],
      nivelDolor: ['', [Validators.required, Validators.min(0), Validators.max(10)]],
      nivelDificultad: ['', [Validators.required, Validators.min(0), Validators.max(10)]],
      repeticionesRealizadas: ['', [Validators.required, Validators.min(0)]],
      duracionRealizada: ['', [Validators.required, Validators.min(0)]],
      observacion: ['', Validators.required],
      planEjercicioId: [this.planEjercicioId]
    });

    this.CargarEstadisticasDelEjercicio();

    if (this.modoEdicion) {
      this.cargarEstadistica();
    }
  }

  cargarEstadistica(): void {
    this.estadisticaService.getById(this.estadisticaId).subscribe({
      next: (data: EstadisticaDTO) => {
        this.estadisticaForm.get('id')?.setValue(data.id);
        this.estadisticaForm.get('fecha')?.setValue(data.fecha);
        this.estadisticaForm.get('nivelDolor')?.setValue(data.nivelDolor);
        this.estadisticaForm.get('nivelDificultad')?.setValue(data.nivelDificultad);
        this.estadisticaForm.get('repeticionesRealizadas')?.setValue(data.repeticionesRealizadas);
        this.estadisticaForm.get('duracionRealizada')?.setValue(data.duracionRealizada);
        this.estadisticaForm.get('observacion')?.setValue(data.observacion);
        this.estadisticaForm.get('planEjercicioId')?.setValue(data.planEjercicioId);
      },
      error: (err) => {
        console.log('ERROR AL CARGAR ESTADISTICA:', err);

        this.snackBar.open('No se pudo cargar el progreso', 'Cerrar', {
          duration: 3000
        });
      }
    });
  }

  CargarEstadisticasDelEjercicio(): void {
    this.estadisticaService.listByPlanEjercicioId(this.planEjercicioId).subscribe({
      next: (data: EstadisticaDTO[]) => {
        this.listaEstadisticas = data;
      },
      error: (err) => {
        console.log('ERROR AL CARGAR ESTADISTICAS DEL EJERCICIO:', err);
      }
    });
  }

  obtenerFechaHoyTexto(): string {
    const hoy = new Date();
    const anio = hoy.getFullYear();
    const mes = String(hoy.getMonth() + 1).padStart(2, '0');
    const dia = String(hoy.getDate()).padStart(2, '0');

    return `${anio}-${mes}-${dia}`;
  }

  existeEstadisticaMismaFecha(fechaTexto: string): boolean {
    return this.listaEstadisticas.some(e =>
      e.fecha === fechaTexto &&
      e.id !== this.estadisticaId
    );
  }

  validarRegistroDeHoy(): boolean {
    const fechaHoy = this.obtenerFechaHoyTexto();

    if (this.existeEstadisticaMismaFecha(fechaHoy)) {
      this.snackBar.open('Ya existe un progreso registrado para este ejercicio el día de hoy', 'Cerrar', {
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

    if (!this.modoEdicion && !this.validarRegistroDeHoy()) {
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
      fecha: this.modoEdicion
        ? this.estadisticaForm.get('fecha')?.value
        : this.obtenerFechaHoyTexto(),
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