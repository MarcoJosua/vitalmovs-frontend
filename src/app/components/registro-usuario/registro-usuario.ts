import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserDTO } from '../../models/userDTO';
import { UserService } from '../../services/user-service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-registro-usuario',
  standalone: false,
  templateUrl: './registro-usuario.html',
  styleUrl: './registro-usuario.css',
})
export class RegistroUsuario {

  username: string = '';
  password: string = '';
  confirmarPassword: string = '';
  tipoUsuario: string = '';

  constructor(
    private userService: UserService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  registrarUsuario(): void {

    if (!this.username || !this.password || !this.confirmarPassword || !this.tipoUsuario) {
      this.snackBar.open('Completa todos los campos', 'Cerrar', {
        duration: 2500
      });
      return;
    }

    if (this.password !== this.confirmarPassword) {
      this.snackBar.open('Las contraseñas no coinciden', 'Cerrar', {
        duration: 2500
      });
      return;
    }

    const userDTO: UserDTO = {
      id: 0,
      username: this.username,
      password: this.password,
      authorities: this.tipoUsuario
    };

    this.userService.register(userDTO).subscribe({
      next: (data: UserDTO) => {

        this.snackBar.open('Usuario creado correctamente. Ahora completa tus datos.', 'Cerrar', {
          duration: 3000
        });

        if (this.tipoUsuario === 'ROLE_PACIENTE') {
          this.router.navigate(['/paciente/agregar', data.id]);
        }

        if (this.tipoUsuario === 'ROLE_FISIOTERAPEUTA') {
          this.router.navigate(['/fisioterapeuta/agregar', data.id]);
        }
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open('No se pudo crear el usuario. Verifica si ya existe.', 'Cerrar', {
          duration: 3000
        });
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/login']);
  }
}