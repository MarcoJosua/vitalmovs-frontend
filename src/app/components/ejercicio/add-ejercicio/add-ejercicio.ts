import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EjercicioDTO } from '../../../models/EjercicioDTO';
import { EjercicioService } from '../../../services/ejercicio-service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-ejercicio',
  standalone: false,
  templateUrl: './add-ejercicio.html',
  styleUrl: './add-ejercicio.css',
})
export class AddEjercicio implements OnInit {

  ejercicioId: number | null = null;
  modoEdicion: boolean = false;
  cargando: boolean = false;

  ejercicio: EjercicioDTO = {
    id: 0,
    nombre: '',
    descripcion: ''
  };

  constructor(
    private ejercicioService: EjercicioService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const ejercicioIdParam = this.route.snapshot.paramMap.get('ejercicioId');

    if (ejercicioIdParam) {
      this.ejercicioId = Number(ejercicioIdParam);
      this.modoEdicion = true;
      this.cargarEjercicio();
    }
  }

  cargarEjercicio(): void {
    this.cargando = true;
    this.cdr.detectChanges();

    this.ejercicioService.listAll().subscribe({
      next: (data: EjercicioDTO[]) => {
        const encontrado = data.find(e => e.id === this.ejercicioId);

        if (encontrado) {
          this.ejercicio = {
            id: encontrado.id,
            nombre: encontrado.nombre,
            descripcion: encontrado.descripcion
          };
        }

        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.cargando = false;
        this.snackBar.open('No se pudo cargar el ejercicio', 'Cerrar', {
          duration: 2500
        });
        this.cdr.detectChanges();
      }
    });
  }

  guardar(): void {
    if (!this.ejercicio.nombre || !this.ejercicio.descripcion) {
      this.snackBar.open('Completa todos los campos', 'Cerrar', {
        duration: 2500
      });
      return;
    }

    if (this.modoEdicion) {
      this.actualizar();
    } else {
      this.crear();
    }
  }

  crear(): void {
    const nuevoEjercicio: EjercicioDTO = {
      id: 0,
      nombre: this.ejercicio.nombre,
      descripcion: this.ejercicio.descripcion
    };

    this.ejercicioService.add(nuevoEjercicio).subscribe({
      next: () => {
        this.snackBar.open('Ejercicio creado correctamente', 'Cerrar', {
          duration: 2500
        });
        this.router.navigate(['/ejercicio/list-ejercicios']);
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open('No se pudo crear el ejercicio. Verifica si ya existe.', 'Cerrar', {
          duration: 3000
        });
      }
    });
  }

  actualizar(): void {
    const ejercicioActualizado: EjercicioDTO = {
      id: this.ejercicioId!,
      nombre: this.ejercicio.nombre,
      descripcion: this.ejercicio.descripcion
    };

    this.ejercicioService.update(ejercicioActualizado).subscribe({
      next: () => {
        this.snackBar.open('Ejercicio actualizado correctamente', 'Cerrar', {
          duration: 2500
        });
        this.router.navigate(['/ejercicio/list-ejercicios']);
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open('No se pudo actualizar el ejercicio', 'Cerrar', {
          duration: 3000
        });
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/ejercicio/list-ejercicios']);
  }
}