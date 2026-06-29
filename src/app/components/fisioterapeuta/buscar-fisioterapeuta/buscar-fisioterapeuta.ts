import { Component } from '@angular/core';
import { Fisioterapeuta } from '../../models/fisioterapeuta.model';
import { FisioterapeutaService } from '../../services/fisioterapeuta.service';

@Component({
  selector: 'app-buscar-fisioterapeuta',
  templateUrl: './buscar-fisioterapeuta.component.html'
})
export class BuscarFisioterapeutaComponent {

  textoBusqueda: string = '';
  especialidadBusqueda: string = '';
  resultados: Fisioterapeuta[] = [];
  buscado: boolean = false;

  constructor(private fisioterapeutaService: FisioterapeutaService) {}

  buscarPorNombre(): void {
    if (!this.textoBusqueda.trim()) return;
    this.fisioterapeutaService.buscarPorNombreOApellido(this.textoBusqueda).subscribe({
      next: (data) => { this.resultados = data; this.buscado = true; },
      error: (err) => console.error('Error en búsqueda', err)
    });
  }

  buscarPorEspecialidad(): void {
    if (!this.especialidadBusqueda.trim()) return;
    this.fisioterapeutaService.findByEspecialidad(this.especialidadBusqueda).subscribe({
      next: (data) => { this.resultados = data; this.buscado = true; },
      error: (err) => console.error('Error en búsqueda por especialidad', err)
    });
  }

  limpiar(): void {
    this.textoBusqueda = '';
    this.especialidadBusqueda = '';
    this.resultados = [];
    this.buscado = false;
  }
}
