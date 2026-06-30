import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TipoDiscapacidad } from '../../../models/tipodiscapacidadDTO';
import { TipoDiscapacidadService } from '../../../services/tipo-discapacidad-services';


@Component({
  selector: 'app-list-tipo-discapacidad',
  templateUrl: './list-tipo-discapacidad.html',
  standalone: false,
  styleUrls: ['./list-tipo-discapacidad.css']
})
export class ListTipoDiscapacidadComponent implements OnInit {
  tipos: TipoDiscapacidad[] = [];
  columnas: string[] = ['id', 'nombre', 'descripcion', 'acciones'];

  constructor(
    private tipoDiscapacidadService: TipoDiscapacidadService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarTipos();
  }

  cargarTipos(): void {
    this.tipoDiscapacidadService.listAll().subscribe({
      next: (data) => this.tipos = data,
      error: (err) => console.error('Error al cargar tipos de discapacidad', err)
    });
  }

  editar(id: number): void {
    this.router.navigate(['/tipos-discapacidad/editar', id]);
  }

  eliminar(id: number): void {
    if (confirm('¿Seguro que deseas eliminar este tipo de discapacidad?')) {
      this.tipoDiscapacidadService.delete(id).subscribe({
        next: () => this.cargarTipos(),
        error: (err) => console.error('Error al eliminar', err)
      });
    }
  }

  nuevo(): void {
    this.router.navigate(['/tipos-discapacidad/nuevo']);
  }
}
