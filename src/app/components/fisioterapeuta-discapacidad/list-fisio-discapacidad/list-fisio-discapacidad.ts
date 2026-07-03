import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { FisioterapeutaDiscapacidad } from '../../../models/FisioterapeutaDiscapacidadDTO';
import { FisioterapeutaDiscapacidadService } from '../../../services/Fisioterapeuta-Discapacidad-service';
import { TipoDiscapacidadService } from '../../../services/tipo-discapacidad-services';
import { TipoDiscapacidad } from '../../../models/tipodiscapacidadDTO';

interface FilaFisioDiscapacidad extends FisioterapeutaDiscapacidad {
  nombreTipo?: string;
  descripcionTipo?: string;
}

@Component({
  selector: 'app-list-fisio-discapacidad',
  templateUrl: './list-fisio-discapacidad.html',
  standalone: false,
  styleUrls: ['./list-fisio-discapacidad.css']
})
export class ListFisioDiscapacidadComponent implements OnInit {

  fisioterapeutaId!: number;
  discapacidades: FilaFisioDiscapacidad[] = [];
  cargando: boolean = false;

  constructor(
    private fdService: FisioterapeutaDiscapacidadService,
    private tipoDiscapacidadService: TipoDiscapacidadService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.fisioterapeutaId = Number(
      this.route.snapshot.paramMap.get('fisioterapeutaId') ||
      this.route.snapshot.paramMap.get('id')
    );

    console.log('Fisioterapeuta ID recibido:', this.fisioterapeutaId);

    this.cargar();
  }

  cargar(): void {
    if (!this.fisioterapeutaId) {
      console.error('No se recibió fisioterapeutaId');
      return;
    }

    this.cargando = true;
    this.cdr.detectChanges();

    forkJoin({
      asignados: this.fdService.findByFisioterapeutaId(this.fisioterapeutaId),
      tipos: this.tipoDiscapacidadService.listAll()
    }).subscribe({
      next: ({ asignados, tipos }) => {
        this.discapacidades = asignados.map(d => {
          const tipo = tipos.find((t: TipoDiscapacidad) => t.id === d.tipoDiscapacidadId);

          return {
            ...d,
            nombreTipo: tipo ? tipo.nombre : 'Tipo no encontrado',
            descripcionTipo: tipo ? tipo.descripcion : ''
          };
        });

        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar discapacidades del fisioterapeuta', err);
        this.discapacidades = [];
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  agregar(): void {
    this.router.navigate(['/fisioterapeuta', this.fisioterapeutaId, 'discapacidad', 'agregar']);
  }

  eliminar(id: number): void {
    if (confirm('¿Eliminar esta discapacidad del fisioterapeuta?')) {
      this.fdService.delete(id).subscribe({
        next: () => this.cargar(),
        error: (err) => console.error('Error al eliminar', err)
      });
    }
  }

  volver(): void {
    this.router.navigate(['/fisioterapeuta/list-fisioterapeutas']);
  }
}