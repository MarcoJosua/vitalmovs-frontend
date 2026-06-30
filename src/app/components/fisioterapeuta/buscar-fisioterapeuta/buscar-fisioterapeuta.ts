import { Component } from '@angular/core';
import { Fisioterapeuta } from '../../../models/FisioterapeutaDTO';
import { FisioterapeutaService } from '../../../services/Fisioterapeuta-service';


@Component({
  selector: 'app-buscar-fisioterapeuta',
  standalone: false,
  templateUrl: './buscar-fisioterapeuta.html',
  styleUrls: ['./buscar-fisioterapeuta.css']
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
