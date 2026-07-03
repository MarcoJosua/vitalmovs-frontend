import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { TipoDiscapacidad } from '../../../models/tipodiscapacidadDTO';
import { TipoDiscapacidadService } from '../../../services/tipo-discapacidad-services';
import { FisioterapeutaDiscapacidadService } from '../../../services/Fisioterapeuta-Discapacidad-service';

interface OpcionDiscapacidad {
  tipo: TipoDiscapacidad;
  marcado: boolean;
  registroId: number | null;
}

@Component({
  selector: 'app-add-fisio-discapacidad',
  templateUrl: './add-fisio-discapacidad.html',
  standalone: false,
  styleUrls: ['./add-fisio-discapacidad.css']
})
export class AddFisioDiscapacidadComponent implements OnInit {

  fisioterapeutaId!: number;
  opciones: OpcionDiscapacidad[] = [];
  modoRegistro: boolean = false;
  cargando: boolean = false;

  constructor(
    private tipoDiscapacidadService: TipoDiscapacidadService,
    private fisioterapeutaDiscapacidadService: FisioterapeutaDiscapacidadService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const fisioterapeutaIdParam =
      this.route.snapshot.paramMap.get('fisioterapeutaId') ||
      this.route.snapshot.paramMap.get('id');

    this.fisioterapeutaId = Number(fisioterapeutaIdParam);
    this.modoRegistro = this.router.url.includes('/registro');

    console.log('Fisioterapeuta ID recibido en agregar discapacidad:', this.fisioterapeutaId);

    if (!this.fisioterapeutaId) {
      console.error('No se pudo obtener el fisioterapeutaId desde la ruta');
      this.cargando = false;
      this.cdr.detectChanges();
      return;
    }

    this.cargarTiposDiscapacidad();
  }

  cargarTiposDiscapacidad(): void {
    this.cargando = true;
    this.cdr.detectChanges();

    forkJoin({
      tipos: this.tipoDiscapacidadService.listAll().pipe(
        catchError(err => {
          console.error('Error al cargar tipos de discapacidad', err);
          return of([]);
        })
      ),
      asignados: this.fisioterapeutaDiscapacidadService.findByFisioterapeutaId(this.fisioterapeutaId).pipe(
        catchError(err => {
          console.error('Error al cargar discapacidades asignadas del fisioterapeuta', err);
          return of([]);
        })
      )
    })
    .pipe(
      finalize(() => {
        this.cargando = false;
        this.cdr.detectChanges();
      })
    )
    .subscribe({
      next: ({ tipos, asignados }) => {
        console.log('Tipos recibidos:', tipos);
        console.log('Asignados recibidos:', asignados);

        this.opciones = tipos.map((tipo: TipoDiscapacidad) => {
          const encontrado = asignados.find((a: any) => a.tipoDiscapacidadId === tipo.id);

          return {
            tipo: tipo,
            marcado: !!encontrado,
            registroId: encontrado && encontrado.id !== undefined ? encontrado.id : null
          };
        });

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error general al cargar opciones', err);
        this.opciones = [];
        this.cdr.detectChanges();
      }
    });
  }

  guardar(): void {
    const operaciones: any[] = [];

    for (const opcion of this.opciones) {
      const yaExiste = opcion.registroId !== null;

      if (opcion.marcado && !yaExiste) {
        operaciones.push(this.fisioterapeutaDiscapacidadService.add({
          fisioterapeutaId: this.fisioterapeutaId,
          tipoDiscapacidadId: opcion.tipo.id!
        }));
      }

      if (!opcion.marcado && yaExiste) {
        operaciones.push(this.fisioterapeutaDiscapacidadService.delete(opcion.registroId!));
      }
    }

    if (operaciones.length === 0) {
      this.finalizar();
      return;
    }

    forkJoin(operaciones).subscribe({
      next: () => this.finalizar(),
      error: (err) => console.error('Error al guardar discapacidades del fisioterapeuta', err)
    });
  }

  finalizar(): void {
    if (this.modoRegistro) {
      this.router.navigate(['/login']);
    } else {
      this.router.navigate(['/fisioterapeuta', this.fisioterapeutaId, 'discapacidad']);
    }
  }

  ahoraNo(): void {
    this.router.navigate(['/login']);
  }

  cancelar(): void {
    if (this.modoRegistro) {
      this.router.navigate(['/login']);
    } else {
      this.router.navigate(['/fisioterapeuta', this.fisioterapeutaId, 'discapacidad']);
    }
  }
}