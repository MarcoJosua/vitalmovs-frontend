import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PlanRehabilitacionService } from '../../../services/plan-rehabilitacion-service';
import { PlanRehabilitacionDTO } from '../../../models/PlanRehabilitacionDTO';

@Component({
  selector: 'app-add-planes',
  standalone: false,
  templateUrl: './add-planes.html',
  styleUrl: './add-planes.css',
})
export class AddPlanes implements OnInit {

  planForm!: FormGroup;

  asignacionId: number = 0;
  planId: number = 0;

  modoEdicion: boolean = false;
  estadoActual: string = 'ACTIVO';

  fechaHoy: Date = new Date();

  constructor( private formBuilder: FormBuilder, private planRehabilitacionService: PlanRehabilitacionService, 
               private route: ActivatedRoute, private router: Router, private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const planIdParam = this.route.snapshot.paramMap.get('planId');
    const asignacionIdParam = this.route.snapshot.paramMap.get('asignacionId');

    this.planForm = this.formBuilder.group({
      id: [0],
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      fecha_inicio: ['', Validators.required],
      fecha_fin: ['', Validators.required],
      asignacionId: [0]
  });

    if (planIdParam != null) {
      this.modoEdicion = true;
      this.planId = Number(planIdParam);
      this.cargarPlan();
    } else {
      this.modoEdicion = false;
      this.asignacionId = Number(asignacionIdParam);
      this.planForm.get('id')?.setValue(0);
      this.planForm.get('asignacionId')?.setValue(this.asignacionId);
    }
    
  }

  cargarPlan(): void {
    this.planRehabilitacionService.getById(this.planId).subscribe({
      next: (data: PlanRehabilitacionDTO) => {
        console.log('PLAN A EDITAR:', data);

        this.estadoActual = data.estado;
        this.asignacionId = data.asignacionId;

        this.planForm.get('id')?.setValue(data.id);
        this.planForm.get('nombre')?.setValue(data.nombre);
        this.planForm.get('descripcion')?.setValue(data.descripcion);
        this.planForm.get('fecha_inicio')?.setValue(new Date(data.fecha_inicio));
        this.planForm.get('fecha_fin')?.setValue(new Date(data.fecha_fin));
        this.planForm.get('asignacionId')?.setValue(data.asignacionId);

        // En edición solo se permite modificar nombre y fecha de fin.
        this.planForm.get('fecha_inicio')?.disable();
        this.planForm.get('asignacionId')?.disable();
      },
      error: (err) => {
        console.log('ERROR AL CARGAR PLAN:', err);
      }
    });
  }

  guardarPlan(): void {
    if (this.planForm.invalid) {
      this.snackBar.open('Complete todos los campos del plan', 'Cerrar', {
        duration: 3000
      });
      return;
    }

    const valores = this.planForm.getRawValue();

    const fechaInicio = new Date(valores.fecha_inicio);
    const fechaFin = new Date(valores.fecha_fin);

    if (fechaFin < fechaInicio) {
      this.snackBar.open('La fecha de fin no puede ser menor que la fecha de inicio', 'Cerrar', {
        duration: 3000
      });
      return;
    }

    const planDTO: PlanRehabilitacionDTO = {
      id: this.modoEdicion ? this.planId : 0,
      nombre: valores.nombre,
      descripcion: valores.descripcion,
      fecha_inicio: this.convertirFecha(valores.fecha_inicio),
      fecha_fin: this.convertirFecha(valores.fecha_fin),
      estado: this.modoEdicion ? this.estadoActual : 'ACTIVO',
      asignacionId: valores.asignacionId
    };

    if (this.modoEdicion) {
      this.planRehabilitacionService.update(planDTO).subscribe({
        next: () => {
          this.snackBar.open('Plan actualizado correctamente', 'Cerrar', { duration: 3000});
          this.router.navigate(['/plan-rehabilitacion/list-planes']);
        },
        error: (err) => {
        }
      });
    } else {
      this.planRehabilitacionService.add(planDTO).subscribe({
        next: () => {
          this.snackBar.open('Plan creado correctamente', 'Cerrar', {duration: 3000});
          this.router.navigate(['/plan-rehabilitacion/list-planes']);
        },
        error: (err) => {
        }
      });
    }
  }

  convertirFecha(fecha: Date): string {
    return fecha.toISOString().split('T')[0];
  }

  cancelar(): void {
    this.router.navigate(['/plan-rehabilitacion/list-planes']);
  }
}