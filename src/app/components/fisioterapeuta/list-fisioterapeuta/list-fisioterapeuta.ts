import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FisioterapeutaService } from '../../../services/Fisioterapeuta-service';
import { Fisioterapeuta } from '../../../models/FisioterapeutaDTO';

@Component({
  selector: 'app-list-fisioterapeuta',
  templateUrl: './list-fisioterapeuta.html',
  standalone: false,
  styleUrls: ['./list-fisioterapeuta.css']
})
export class ListFisioterapeutaComponent implements OnInit {

  fisioterapeutas: Fisioterapeuta[] = [];
  fisioterapeutasFiltrados: Fisioterapeuta[] = [];
  textoBusqueda: string = '';

  constructor(
    private fisioterapeutaService: FisioterapeutaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.fisioterapeutaService.listAll().subscribe({
      next: (data) => {
        this.fisioterapeutas = data;
        this.fisioterapeutasFiltrados = data;
      },
      error: (err) => console.error('Error al cargar fisioterapeutas', err)
    });
  }

  buscar(): void {
    const texto = this.textoBusqueda.toLowerCase().trim();
    this.fisioterapeutasFiltrados = this.fisioterapeutas.filter(f =>
      f.nombre.toLowerCase().includes(texto) ||
      f.apellido.toLowerCase().includes(texto)
    );
  }

  verDiscapacidades(id: number): void {
    this.router.navigate(['/fisioterapeuta', id, 'discapacidad']);
  }
}
