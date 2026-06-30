import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FisioterapeutaDiscapacidad } from '../../../models/FisioterapeutaDiscapacidadDTO';
import { FisioterapeutaDiscapacidadService } from '../../../services/Fisioterapeuta-Discapacidad-service';

@Component({
  selector: 'app-list-fisio-discapacidad',
  templateUrl: './list-fisio-discapacidad.html',
  standalone: false,
  styleUrls: ['./list-fisio-discapacidad.css']
})
export class ListFisioDiscapacidadComponent implements OnInit {

  fisioterapeutaId!: number;
  discapacidades: FisioterapeutaDiscapacidad[] = [];

  constructor(
    private fdService: FisioterapeutaDiscapacidadService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fisioterapeutaId = Number(this.route.snapshot.paramMap.get('id'));
    this.cargar();
  }

  cargar(): void {
    this.fdService.findByFisioterapeutaId(this.fisioterapeutaId).subscribe({
      next: (data) => this.discapacidades = data,
      error: (err) => console.error('Error al cargar discapacidades', err)
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
