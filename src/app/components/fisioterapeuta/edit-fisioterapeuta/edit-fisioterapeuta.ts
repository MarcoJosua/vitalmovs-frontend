import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Fisioterapeuta } from '../../../models/FisioterapeutaDTO';
import { FisioterapeutaService } from '../../../services/Fisioterapeuta-service';


@Component({
  selector: 'app-edit-fisioterapeuta',
  templateUrl: './edit-fisioterapeuta.html',
  standalone: false,
  styleUrls: ['./edit-fisioterapeuta.css']
})
export class EditFisioterapeutaComponent implements OnInit {

  fisioterapeuta: Fisioterapeuta = {
    nombre: '',
    apellido: '',
    especialidad: '',
    userId: 0
  };

  constructor(
    private fisioterapeutaService: FisioterapeutaService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.fisioterapeutaService.listAll().subscribe({
      next: (data) => {
        const encontrado = data.find(f => f.id === id);
        if (encontrado) {
          this.fisioterapeuta = { ...encontrado };
        }
      },
      error: (err) => console.error('Error al cargar fisioterapeuta', err)
    });
  }
guardar(): void {
  this.fisioterapeutaService.update(this.fisioterapeuta).subscribe({
    next: () => this.router.navigate(['/fisioterapeuta/list-fisioterapeutas']),
    error: (err) => console.error('Error al actualizar', err)
  });
}
cancelar(): void {
  this.router.navigate(['/fisioterapeuta/list-fisioterapeutas']);
}
}
