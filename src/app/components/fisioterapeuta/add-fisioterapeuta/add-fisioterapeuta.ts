import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Fisioterapeuta } from '../../../models/FisioterapeutaDTO';
import { FisioterapeutaService } from '../../../services/Fisioterapeuta-service';

@Component({
  selector: 'app-add-fisioterapeuta',
  standalone: false,
  templateUrl: './add-fisioterapeuta.html',
  styleUrls: ['./add-fisioterapeuta.css']
})
export class AddFisioterapeutaComponent implements OnInit {

  modoRegistro: boolean = false;
  especialidades: string[] = [
    'Fisioterapia neurológica',
    'Fisioterapia traumatológica',
    'Fisioterapia deportiva',
    'Fisioterapia respiratoria',
    'Fisioterapia geriátrica',
    'Fisioterapia pediátrica',
    'Rehabilitación física general'
];
  fisioterapeuta: Fisioterapeuta = {
    nombre: '',
    apellido: '',
    especialidad: '',
    userId: 0
  };

  constructor(
    private fisioterapeutaService: FisioterapeutaService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const userIdParam = this.route.snapshot.paramMap.get('userId');

    if (userIdParam) {
      this.modoRegistro = true;
      this.fisioterapeuta.userId = Number(userIdParam);
    }
  }

  guardar(): void {
    if (
      !this.fisioterapeuta.nombre ||
      !this.fisioterapeuta.apellido ||
      !this.fisioterapeuta.especialidad ||
      !this.fisioterapeuta.userId
    ) {
      this.snackBar.open('Completa todos los campos', 'Cerrar', {
        duration: 2500
      });
      return;
    }

    this.fisioterapeutaService.add(this.fisioterapeuta).subscribe({
     next: (data: Fisioterapeuta) => {
        this.snackBar.open('Fisioterapeuta registrado correctamente. Ahora selecciona los tipos de discapacidad que atiendes.', 'Cerrar', {
          duration: 3000
        });

        if (this.modoRegistro) {
          this.router.navigate(['/fisioterapeuta', data.id, 'discapacidad', 'agregar', 'registro']);
        } else {
          this.router.navigate(['/fisioterapeuta/list-fisioterapeutas']);
        }
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open('Error al guardar fisioterapeuta', 'Cerrar', {
          duration: 2500
        });
      }
    });
  }

  cancelar(): void {
    if (this.modoRegistro) {
      this.router.navigate(['/login']);
    } else {
      this.router.navigate(['/fisioterapeuta/list-fisioterapeutas']);
    }
  }
}