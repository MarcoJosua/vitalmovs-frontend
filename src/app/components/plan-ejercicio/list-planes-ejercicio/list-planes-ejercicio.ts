import { Component, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PlanEjercicioDTO } from '../../../models/PlanEjercicioDTO';
import { PlanEjercicioService } from '../../../services/plan-ejercicio-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EstadisticaDTO } from '../../../models/EstadisticaDTO';
import { EstadisticaService } from '../../../services/estadistica-service';

@Component({
  selector: 'app-list-planes-ejercicio',
  standalone: false,
  templateUrl: './list-planes-ejercicio.html',
  styleUrl: './list-planes-ejercicio.css',
})
export class ListPlanesEjercicio {
  planId: number = 0;

  listaPlanEjercicios: PlanEjercicioDTO[] = [];
  
  listaEstadisticas: EstadisticaDTO[] = [];

  diasSemana: string[] = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO'];

  filas: number[] = [];

  // Paciente -> fisioterapeutaId 0
  // Fisio 1 -> fisioterapeutaId 1
  // Fisio 2 -> fisioterapeutaId 2
  // Fisio 3 -> fisioterapeutaId 3
  fisioterapeutaId: number = 0;

  constructor(
    private planEjercicioService: PlanEjercicioService,
    private estadisticaService: EstadisticaService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.planId = Number(this.activatedRoute.snapshot.paramMap.get('planId'));
    this.CargaLista();
    this.CargarEstadisticas();
  }

  CargaLista(): void {
    this.planEjercicioService.findByPlanIdOrdenado(this.planId).subscribe({
      next: (data: PlanEjercicioDTO[]) => {
        this.listaPlanEjercicios = data;

        this.generarFilas();

        console.log('PLAN ID:', this.planId);
        console.log('EJERCICIOS DEL PLAN:', this.listaPlanEjercicios);

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log('ERROR AL CARGAR PLAN EJERCICIO:', err);
      }
    });
  }

  CargarEstadisticas(): void {
    this.estadisticaService.listByPlanRehabilitacionId(this.planId).subscribe({
      next: (data: EstadisticaDTO[]) => {
        this.listaEstadisticas = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
      }
    });
  }

  obtenerEstadistica(planEjercicioId: number): EstadisticaDTO | undefined {
    return this.listaEstadisticas.find(e =>
      e.planEjercicioId === planEjercicioId
    );
  }

  generarFilas(): void {
    if (this.listaPlanEjercicios.length === 0) {
      this.filas = [1];
      return;
    }

    const maxOrden = Math.max(...this.listaPlanEjercicios.map(e => e.orden));

    this.filas = Array.from({ length: maxOrden }, (_, i) => i + 1);
  }

  obtenerEjercicio(dia: string, orden: number): PlanEjercicioDTO | undefined {
    return this.listaPlanEjercicios.find(e =>
      e.diaSemana.toUpperCase() === dia &&
      e.orden === orden
    );
  }

  agregarEjercicio(): void {
    this.router.navigate(['/plan-rehabilitacion', this.planId, 'plan-ejercicio', 'agregar']);
  }

  editarEjercicio(planEjercicioId: number): void {
    this.router.navigate(['/plan-rehabilitacion', this.planId, 'plan-ejercicio', 'editar', planEjercicioId]);
  }

  eliminarEjercicio(planEjercicioId: number): void {
    this.planEjercicioService.delete(planEjercicioId).subscribe({
      next: () => {
        this.snackBar.open('Ejercicio eliminado del plan', 'Cerrar', {
          duration: 3000
        });

        this.CargaLista();
      },
      error: (err) => {
      }
    });
  }

  subirProgreso(planEjercicioId: number): void {
    this.router.navigate(['/plan-rehabilitacion',this.planId,'plan-ejercicio',planEjercicioId,'progreso']);
  }

  editarProgreso(planEjercicioId: number, estadisticaId: number): void {
    this.router.navigate(['/plan-rehabilitacion',this.planId,'plan-ejercicio',planEjercicioId,'progreso','editar',estadisticaId]);
  }

  volver(): void {
    this.router.navigate(['/plan-rehabilitacion/list-planes']);
  }
}
