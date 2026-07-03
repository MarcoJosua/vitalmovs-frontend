import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PacienteService } from '../../../services/paciente-services';
import { Paciente } from '../../../models/pacienteDTO';

@Component({
  selector: 'app-add-paciente',
  templateUrl: './add-paciente.html',
  standalone: false,
  styleUrls: ['./add-paciente.css']
})
export class AddPacienteComponent implements OnInit {

  form: FormGroup;
  id: number | null = null;
  modoRegistro: boolean = false;

  constructor(
    private fb: FormBuilder,
    private pacienteService: PacienteService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      edad: [null, [Validators.required, Validators.min(1)]],
      sexo: ['', Validators.required],
      userId: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    const userIdParam = this.route.snapshot.paramMap.get('userId');

    if (userIdParam) {
      this.modoRegistro = true;
      this.form.patchValue({
        userId: Number(userIdParam)
      });
      return;
    }

    const pacienteIdParam =
      this.route.snapshot.paramMap.get('pacienteId') ||
      this.route.snapshot.paramMap.get('id');

    if (pacienteIdParam) {
      this.id = Number(pacienteIdParam);

      this.pacienteService.listAll().subscribe({
        next: (pacientes) => {
          const paciente = pacientes.find(p => p.id === this.id);

          if (paciente) {
            this.form.patchValue(paciente);
          }
        },
        error: (err) => {
          console.error(err);
          this.snackBar.open('No se pudo cargar el paciente', 'Cerrar', {
            duration: 2500
          });
        }
      });
    }
  }

  guardar(): void {
    if (this.form.invalid) {
      this.snackBar.open('Completa todos los campos', 'Cerrar', {
        duration: 2500
      });
      return;
    }

    if (this.id) {
      const pacienteActualizado: Paciente = {
        id: this.id,
        ...this.form.value
      };

      this.pacienteService.update(pacienteActualizado).subscribe({
        next: () => {
          this.snackBar.open('Paciente actualizado correctamente', 'Cerrar', {
            duration: 2500
          });
          this.router.navigate(['/paciente/list-pacientes']);
        },
        error: (err) => {
          console.error(err);
          this.snackBar.open('Error al actualizar paciente', 'Cerrar', {
            duration: 2500
          });
        }
      });
    } else {
      const nuevoPaciente: Paciente = {
        id: 0,
        ...this.form.value
      };

      this.pacienteService.add(nuevoPaciente).subscribe({
        next: (data: Paciente) => {
         this.snackBar.open('Paciente registrado correctamente. Ahora selecciona tus tipos de discapacidad.', 'Cerrar', {
          duration: 3000
        });

        if (this.modoRegistro) {
          this.router.navigate(['/paciente', data.id, 'discapacidad', 'agregar', 'registro']);
        } else {
          this.router.navigate(['/paciente/list-pacientes']);
       }
     },
      error: (err) => {
        console.error(err);
        this.snackBar.open('Error al crear paciente', 'Cerrar', {
          duration: 2500
        });
      }
    });
    }
  }

  cancelar(): void {
    if (this.modoRegistro) {
      this.router.navigate(['/login']);
    } else {
      this.router.navigate(['/paciente/list-pacientes']);
    }
  }
}