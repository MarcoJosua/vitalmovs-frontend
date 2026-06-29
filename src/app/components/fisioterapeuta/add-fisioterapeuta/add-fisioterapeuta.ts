import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Fisioterapeuta } from '../../models/fisioterapeuta.model';
import { FisioterapeutaService } from '../../services/fisioterapeuta.service';

@Component({
  selector: 'app-add-fisioterapeuta',
  templateUrl: './add-fisioterapeuta.component.html'
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
      next: () => this.router.navigate(['/fisioterapeutas']),
      error: (err) => console.error('Error al guardar fisioterapeuta', err)
    });
  }

  cancelar(): void {
    this.router.navigate(['/fisioterapeutas']);
  }
}
