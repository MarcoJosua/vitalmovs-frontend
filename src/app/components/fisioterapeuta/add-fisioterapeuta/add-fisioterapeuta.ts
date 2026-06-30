import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Fisioterapeuta } from '../../../models/FisioterapeutaDTO';
import { FisioterapeutaService } from '../../../services/Fisioterapeuta-service';

@Component({
  selector: 'app-add-fisioterapeuta',
  standalone: false,
  templateUrl: './add-fisioterapeuta.html',
  styleUrls: ['./add-fisioterapeuta.css']
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
