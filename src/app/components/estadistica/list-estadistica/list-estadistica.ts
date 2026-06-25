import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { EstadisticaDTO } from '../../../models/EstadisticaDTO';
import { EstadisticaGraficoDTO } from '../../../models/EstadisticaGraficoDTO';
import { EstadisticaService } from '../../../services/estadistica-service';

@Component({
  selector: 'app-list-estadistica',
  standalone: false,
  templateUrl: './list-estadistica.html',
  styleUrl: './list-estadistica.css',
})
export class ListEstadistica implements OnInit {

  planId: number = 0;

  resumen: EstadisticaGraficoDTO | null = null;

  resumenEjercicios: EstadisticaGraficoDTO[] = [];
  resumenEjerciciosAgrupado: EstadisticaGraficoDTO[] = [];

  estadisticas: EstadisticaDTO[] = [];

  displayedColumns: string[] = [
    'fecha',
    'planEjercicioId',
    'nivelDolor',
    'nivelDificultad',
    'repeticionesRealizadas',
    'duracionRealizada',
    'observacion'
  ];

  constructor(
    private estadisticaService: EstadisticaService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.planId = Number(this.activatedRoute.snapshot.paramMap.get('planId'));
    this.CargarDashboard();
  }

  CargarDashboard(): void {
    this.CargarResumenGeneral();
    this.CargarResumenPorEjercicio();
    this.CargarEstadisticasDelPlan();
  }

  CargarResumenGeneral(): void {
    this.estadisticaService.resumenGeneralPorPlan(this.planId).subscribe({
      next: (data: EstadisticaGraficoDTO) => {
        this.resumen = data;
        console.log('RESUMEN GENERAL:', this.resumen);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log('ERROR AL CARGAR RESUMEN GENERAL:', err);
      }
    });
  }

  CargarResumenPorEjercicio(): void {
    this.estadisticaService.resumenPorEjercicio(this.planId).subscribe({
      next: (data: EstadisticaGraficoDTO[]) => {
        this.resumenEjercicios = data;
        this.resumenEjerciciosAgrupado = this.agruparResumenPorNombreEjercicio(data);

        console.log('RESUMEN POR EJERCICIO ORIGINAL:', this.resumenEjercicios);
        console.log('RESUMEN POR EJERCICIO AGRUPADO:', this.resumenEjerciciosAgrupado);

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log('ERROR AL CARGAR RESUMEN POR EJERCICIO:', err);
      }
    });
  }

  CargarEstadisticasDelPlan(): void {
    this.estadisticaService.listByPlanRehabilitacionId(this.planId).subscribe({
      next: (data: EstadisticaDTO[]) => {
        this.estadisticas = data;
        console.log('ESTADISTICAS DEL PLAN:', this.estadisticas);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log('ERROR AL CARGAR ESTADISTICAS DEL PLAN:', err);
      }
    });
  }

  agruparResumenPorNombreEjercicio(data: EstadisticaGraficoDTO[]): EstadisticaGraficoDTO[] {

    const mapa = new Map<string, any>();

    data.forEach(item => {

      const nombre = item.nombreEjercicio;

      if (!mapa.has(nombre)) {
        mapa.set(nombre, {
          planRehabilitacionId: item.planRehabilitacionId,
          planEjercicioId: item.planEjercicioId,
          nombreEjercicio: item.nombreEjercicio,
          fecha: item.fecha,
          promedioDolor: 0,
          promedioDificultad: 0,
          totalRepeticiones: 0,
          totalDuracion: 0,
          cantidadRegistros: 0,
          sumaDolorPonderada: 0,
          sumaDificultadPonderada: 0
        });
      }

      const actual = mapa.get(nombre);
      const cantidad = item.cantidadRegistros || 0;

      actual.totalRepeticiones += item.totalRepeticiones || 0;
      actual.totalDuracion += item.totalDuracion || 0;
      actual.cantidadRegistros += cantidad;

      actual.sumaDolorPonderada += (item.promedioDolor || 0) * cantidad;
      actual.sumaDificultadPonderada += (item.promedioDificultad || 0) * cantidad;
    });

    return Array.from(mapa.values()).map(item => {

      const cantidad = item.cantidadRegistros || 1;

      return {
        planRehabilitacionId: item.planRehabilitacionId,
        planEjercicioId: item.planEjercicioId,
        nombreEjercicio: item.nombreEjercicio,
        fecha: item.fecha,
        promedioDolor: item.sumaDolorPonderada / cantidad,
        promedioDificultad: item.sumaDificultadPonderada / cantidad,
        totalRepeticiones: item.totalRepeticiones,
        totalDuracion: item.totalDuracion,
        cantidadRegistros: item.cantidadRegistros
      };
    });
  }

  calcularPorcentaje(valor: number | null | undefined, maximo: number): number {
    if (valor == null || maximo === 0) {
      return 0;
    }

    return Math.min((valor / maximo) * 100, 100);
  }

  formatearNumero(valor: number | null | undefined): string {
    if (valor == null) {
      return '0.0';
    }

    return valor.toFixed(1);
  }

  generarCirculo(valor: number | null | undefined, maximo: number): string {
    const porcentaje = this.calcularPorcentaje(valor, maximo);
    return `conic-gradient(#B10EE8 ${porcentaje}%, #e5e7eb ${porcentaje}% 100%)`;
  }

  maximoRepeticionesEjercicio(): number {
    if (this.resumenEjerciciosAgrupado.length === 0) {
      return 1;
    }

    return Math.max(...this.resumenEjerciciosAgrupado.map(e => e.totalRepeticiones || 0), 1);
  }

  maximoDuracionEjercicio(): number {
    if (this.resumenEjerciciosAgrupado.length === 0) {
      return 1;
    }

    return Math.max(...this.resumenEjerciciosAgrupado.map(e => e.totalDuracion || 0), 1);
  }

  obtenerNombreEjercicio(planEjercicioId: number): string {
    const encontrado = this.resumenEjercicios.find(e =>
      e.planEjercicioId === planEjercicioId
    );

    if (encontrado && encontrado.nombreEjercicio) {
      return encontrado.nombreEjercicio;
    }

    return 'Ejercicio #' + planEjercicioId;
  }

  volver(): void {
    this.router.navigate(['/plan-rehabilitacion/list-planes']);
  }
}