import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Foro } from '../../../models/ForoDTO';
import { ForoService } from '../../../services/foro-service';
import { TipoDiscapacidadService } from '../../../services/tipo-discapacidad-services';
import { TipoDiscapacidad } from '../../../models/tipodiscapacidadDTO';

@Component({
  selector: 'app-add-foro',
  templateUrl: './add-foro.html',
  standalone: false,
  styleUrls: ['./add-foro.css']
})
export class AddForoComponent implements OnInit {

  foro: Foro = {
    titulo: '',
    descripcion: '',
    tipoDiscapacidadId: 0
  };

  tipos: TipoDiscapacidad[] = [];
  editando: boolean = false;

  constructor(
    private foroService: ForoService,
    private tipoDiscapacidadService: TipoDiscapacidadService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.tipoDiscapacidadService.listAll().subscribe({
      next: (data) => {
        this.tipos = data;

        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error al cargar tipos', err);
      }
    });

    const foroId = this.route.snapshot.paramMap.get('foroId');
    if (foroId) {
      this.editando = true;
      this.foroService.listAll().subscribe({
        next: (data) => {
          const encontrado = data.find(f => f.id === Number(foroId));
          if (encontrado) {
            this.foro = encontrado;
            this.cdr.markForCheck();
          }
        },
        error: (err) => console.error('Error al cargar foro', err)
      });
    }
  }

  guardar(): void {
    if (this.editando) {
      this.foroService.update(this.foro).subscribe({
        next: () => this.router.navigate(['/foros/list-foros']),
        error: (err) => console.error('Error al actualizar', err)
      });
    } else {
      this.foroService.add(this.foro).subscribe({
        next: () => this.router.navigate(['/foros/list-foros']),
        error: (err) => console.error('Error al guardar', err)
      });
    }
  }

  cancelar(): void {
    this.router.navigate(['/foros/list-foros']);
  }
}
