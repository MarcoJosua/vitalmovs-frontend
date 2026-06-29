import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Fisioterapeuta } from '../../models/fisioterapeuta.model';
import { FisioterapeutaService } from '../../services/fisioterapeuta.service';

@Component({
  selector: 'app-list-fisioterapeuta',
  templateUrl: './list-fisioterapeuta.html',
  styleUrls: ['./list-fisioterapeuta.css']
})
export class ListFisioterapeutaComponent implements OnInit {

  fisioterapeutas: Fisioterapeuta[] = [];

  constructor(
    private fisioterapeutaService: FisioterapeutaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarFisioterapeutas();
  }

  cargarFisioterapeutas(): void {
    this.fisioterapeutaService.listAll().subscribe({
      next: (data) => this.fisioterapeutas = data,
      error: (err) => console.error('Error al cargar fisioterapeutas', err)
    });
  }

  editar(id: number): void {
  this.router.navigate(['/fisioterapeuta/editar', id]);
}

verDiscapacidades(id: number): void {
  this.router.navigate(['/fisioterapeuta', id, 'discapacidad']);
}

  eliminar(id: number): void {
    if (confirm('¿Seguro que deseas eliminar este fisioterapeuta?')) {
      this.fisioterapeutaService.delete(id).subscribe({
        next: () => this.cargarFisioterapeutas(),
        error: (err) => console.error('Error al eliminar', err)
      });
    }
  }
}
