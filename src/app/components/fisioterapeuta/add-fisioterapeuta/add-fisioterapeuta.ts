import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Fisioterapeuta } from '../../models/fisioterapeuta.model';
import { FisioterapeutaService } from '../../services/fisioterapeuta.service';

@Component({
  selector: 'app-add-fisioterapeuta',
  templateUrl: './add-fisioterapeuta.component.html',
  styleUrls: ['./add-fisioterapeuta.component.css']
})
export class AddFisioterapeutaComponent {

  fisioterapeuta: Fisioterapeuta = {
    nombre: '',
    apellido: '',
    especialidad: '',
    userId: 0
  };

  constructor(
    private fisioterapeutaService: FisioterapeutaService,
    private router: Router
  ) {
    const userData = localStorage.getItem('userData');
    if (userData) {
      const parsed = JSON.parse(userData);
      this.fisioterapeuta.userId = parsed.id;
    }
  }
  guardar(): void {
  this.fisioterapeutaService.add(this.fisioterapeuta).subscribe({
    next: () => this.router.navigate(['/fisioterapeuta/list-fisioterapeutas']),
    error: (err) => console.error('Error al guardar', err)
  });
}
cancelar(): void {
  this.router.navigate(['/fisioterapeuta/list-fisioterapeutas']);
}
}
