import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Fisioterapeuta } from '../../models/fisioterapeuta.model';
import { FisioterapeutaService } from '../../services/fisioterapeuta.service';

@Component({
  selector: 'app-edit-fisioterapeuta',
  templateUrl: './edit-fisioterapeuta.component.html',
  styleUrls: ['./edit-fisioterapeuta.component.css']
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
      next: () => this.router.navigate(['/fisioterapeutas']),
      error: (err) => console.error('Error al actualizar', err)
    });
  }

  cancelar(): void {
    this.router.navigate(['/fisioterapeutas']);
  }
}
