import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { PlanEjercicioDTO } from '../../../models/PlanEjercicioDTO';
import { EjercicioDTO } from '../../../models/EjercicioDTO';

import { PlanEjercicioService } from '../../../services/plan-ejercicio-service';
import { EjercicioService } from '../../../services/ejercicio-service';

@Component({
  selector: 'app-add-planes-ejercicio',
  standalone: false,
  templateUrl: './add-planes-ejercicio.html',
  styleUrl: './add-planes-ejercicio.css',
})
export class AddPlanesEjercicio implements OnInit {

  planEjercicioForm!: FormGroup;

  planId: number = 0;
  planEjercicioId: number = 0;
  modoEdicion: boolean = false;

  ejercicios: EjercicioDTO[] = [];
  ejerciciosDelPlan: PlanEjercicioDTO[] = [];

  diasSemana: string[] = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO'];

  constructor(
    private formBuilder: FormBuilder,
    private planEjercicioService: PlanEjercicioService,
    private ejercicioService: EjercicioService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.planId = Number(this.activatedRoute.snapshot.paramMap.get('planId'));

    const planEjercicioIdParam = this.activatedRoute.snapshot.paramMap.get('planEjercicioId');

    if (planEjercicioIdParam != null) {
      this.modoEdicion = true;
      this.planEjercicioId = Number(planEjercicioIdParam);
    }

    this.planEjercicioForm = this.formBuilder.group({
      id: [0],
      ejercicioId: ['', Validators.required],
      diaSemana: ['', Validators.required],
      orden: ['', [Validators.required, Validators.min(1)]],
      series: ['', [Validators.required, Validators.min(1)]],
      repeticiones: ['', [Validators.required, Validators.min(1)]],
      duracionRecomendada: ['', [Validators.required, Validators.min(1)]]
    });

    this.CargarEjercicios();
    this.CargarEjerciciosDelPlan();
  }

  CargarEjercicios(): void {
  this.ejercicioService.listAll().subscribe({
    next: (data: EjercicioDTO[]) => {
      this.ejercicios = data;
      console.log('EJERCICIOS CARGADOS:', this.ejercicios);
    },
    error: (err) => {
      console.log('ERROR AL CARGAR EJERCICIOS:', err);
    }
  });
}

  CargarEjerciciosDelPlan(): void {
    this.planEjercicioService.findByPlanIdOrdenado(this.planId).subscribe({
      next: (data: PlanEjercicioDTO[]) => {
        this.ejerciciosDelPlan = data;

        if (this.modoEdicion) {
          this.CargarPlanEjercicio();
        }
      },
      error: (err) => {
        console.log('ERROR AL CARGAR EJERCICIOS DEL PLAN:', err);
      }
    });
  }

  CargarPlanEjercicio(): void {
    const ejercicioActual = this.ejerciciosDelPlan.find(e => e.id === this.planEjercicioId);

    if (ejercicioActual) {
      this.planEjercicioForm.get('id')?.setValue(ejercicioActual.id);
      this.planEjercicioForm.get('ejercicioId')?.setValue(ejercicioActual.ejercicioId);
      this.planEjercicioForm.get('diaSemana')?.setValue(ejercicioActual.diaSemana);
      this.planEjercicioForm.get('orden')?.setValue(ejercicioActual.orden);
      this.planEjercicioForm.get('series')?.setValue(ejercicioActual.series);
      this.planEjercicioForm.get('repeticiones')?.setValue(ejercicioActual.repeticiones);
      this.planEjercicioForm.get('duracionRecomendada')?.setValue(ejercicioActual.duracionRecomendada);
    }
  }

  espacioOcupado(): boolean {
    const diaSemana = this.planEjercicioForm.get('diaSemana')?.value;
    const orden = Number(this.planEjercicioForm.get('orden')?.value);

    return this.ejerciciosDelPlan.some(e =>
      e.diaSemana === diaSemana &&
      e.orden === orden &&
      e.id !== this.planEjercicioId
    );
  }

  Grabar(): void {
    if (this.planEjercicioForm.invalid) {
      this.snackBar.open('Complete todos los campos correctamente', 'Cerrar', {
        duration: 3000
      });
      return;
    }

    if (this.espacioOcupado()) {
      this.snackBar.open('Ese espacio del horario ya está ocupado para este plan', 'Cerrar', {
        duration: 3000
      });
      return;
    }

    const planEjercicioDTO: PlanEjercicioDTO = {
      id: this.modoEdicion ? this.planEjercicioId : 0,
      series: Number(this.planEjercicioForm.get('series')?.value),
      repeticiones: Number(this.planEjercicioForm.get('repeticiones')?.value),
      duracionRecomendada: Number(this.planEjercicioForm.get('duracionRecomendada')?.value),
      diaSemana: this.planEjercicioForm.get('diaSemana')?.value,
      orden: Number(this.planEjercicioForm.get('orden')?.value),
      planRehabilitacionId: this.planId,
      ejercicioId: Number(this.planEjercicioForm.get('ejercicioId')?.value),
      nombreEjercicio: ''
    };

    if (this.modoEdicion) {
      this.planEjercicioService.update(planEjercicioDTO).subscribe({
        next: () => {
          this.snackBar.open('Ejercicio del plan actualizado correctamente', 'Cerrar', {
            duration: 3000
          });

          this.router.navigate(['/plan-rehabilitacion', this.planId, 'plan-ejercicio']);
        },
        error: (err) => {
          console.log('ERROR AL ACTUALIZAR PLAN EJERCICIO:', err);
        }
      });
    } else {
      this.planEjercicioService.add(planEjercicioDTO).subscribe({
        next: () => {
          this.snackBar.open('Ejercicio agregado al plan correctamente', 'Cerrar', {
            duration: 3000
          });

          this.router.navigate(['/plan-rehabilitacion', this.planId, 'plan-ejercicio']);
        },
        error: (err) => {
          console.log('ERROR AL AGREGAR PLAN EJERCICIO:', err);
        }
      });
    }
  }

  cancelar(): void {
    this.router.navigate(['/plan-rehabilitacion', this.planId, 'plan-ejercicio']);
  }
}
