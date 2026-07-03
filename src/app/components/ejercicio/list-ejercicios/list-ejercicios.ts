import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EjercicioDTO } from '../../../models/EjercicioDTO';
import { EjercicioService } from '../../../services/ejercicio-service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-list-ejercicios',
  standalone: false,
  templateUrl: './list-ejercicios.html',
  styleUrl: './list-ejercicios.css',
})
export class ListEjercicios implements OnInit {

  ejercicios: EjercicioDTO[] = [];
  textoBusqueda: string = '';
  cargando: boolean = false;

  constructor(
    private ejercicioService: EjercicioService,
    private router: Router,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarEjercicios();
  }

  cargarEjercicios(): void {
    this.cargando = true;
    this.cdr.detectChanges();

    this.ejercicioService.listAll().subscribe({
      next: (data: EjercicioDTO[]) => {
        this.ejercicios = data;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.ejercicios = [];
        this.cargando = false;
        this.snackBar.open('No se pudieron cargar los ejercicios', 'Cerrar', {
          duration: 2500
        });
        this.cdr.detectChanges();
      }
    });
  }

  buscar(): void {
    const texto = this.textoBusqueda.trim();

    if (!texto) {
      this.cargarEjercicios();
      return;
    }

    this.cargando = true;
    this.cdr.detectChanges();

    this.ejercicioService.buscarPorNombreODescripcion(texto).subscribe({
      next: (data: EjercicioDTO[]) => {
        this.ejercicios = data;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.ejercicios = [];
        this.cargando = false;
        this.snackBar.open('No se encontraron ejercicios con ese criterio', 'Cerrar', {
          duration: 2500
        });
        this.cdr.detectChanges();
      }
    });
  }

  limpiarBusqueda(): void {
    this.textoBusqueda = '';
    this.cargarEjercicios();
  }

  nuevo(): void {
    this.router.navigate(['/ejercicio/agregar']);
  }

  editar(ejercicio: EjercicioDTO): void {
    this.router.navigate(['/ejercicio/editar', ejercicio.id]);
  }

  eliminar(ejercicio: EjercicioDTO): void {
    if (!confirm('¿Seguro que deseas eliminar este ejercicio?')) {
      return;
    }

    this.ejercicioService.delete(ejercicio.id).subscribe({
      next: () => {
        this.snackBar.open('Ejercicio eliminado correctamente', 'Cerrar', {
          duration: 2500
        });
        this.cargarEjercicios();
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open('No se pudo eliminar el ejercicio. Puede estar asociado a un plan.', 'Cerrar', {
          duration: 3000
        });
      }
    });
  }
}