import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Foro } from '../../../models/ForoDTO';
import { ForoVista } from '../../../models/ForoVistaDTO';
import { ForoService } from '../../../services/foro-service';
import { UserService } from '../../../services/user-service';
import { PacienteService } from '../../../services/paciente-services';
import { TipoDiscapacidadService } from '../../../services/tipo-discapacidad-services';
import { TipoDiscapacidad } from '../../../models/tipodiscapacidadDTO';

@Component({
  selector: 'app-list-foro',
  templateUrl: './list-foro.html',
  standalone: false,
  styleUrls: ['./list-foro.css']
})
export class ListForoComponent implements OnInit {

  foros: any[] = [];
  rol: string = '';

  constructor(
    private foroService: ForoService,
    private userService: UserService,
    private pacienteService: PacienteService,
    private tipoDiscapacidadService: TipoDiscapacidadService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.rol = this.userService.getAuthoritiesLogeado().trim();
    if (this.rol === 'ROLE_PACIENTE') {
      this.cargarForosPaciente();
    } else {
      this.cargarForosAdmin();
    }
  }

  cargarForosPaciente(): void {
    const userId = Number(this.userService.getIdLogeado());
    this.pacienteService.findByUserId(userId).subscribe({
      next: (paciente) => {
        if (paciente.id) {
          this.foroService.listByPacienteId(paciente.id).subscribe({
            next: (data) => {
              this.foros = data;
            },
            error: (err) => console.error('Error al cargar foros', err)
          });
        }
      },
      error: (err) => {
        if (err.status === 404) {
          console.warn('Perfil de paciente no encontrado. Contacta al administrador.');
          this.foros = [];
        } else {
          console.error('Error al obtener paciente', err);
        }
      }
    });
  }

  cargarForosAdmin(): void {
    this.foroService.listAll().subscribe({
      next: (foros) => {
        this.tipoDiscapacidadService.listAll().subscribe({
          next: (tipos) => {
            this.foros = foros.map(f => ({
              ...f,
              nombreTipo: tipos.find((t: TipoDiscapacidad) => t.id === f.tipoDiscapacidadId)?.nombre
            }));
          },
          error: () => {
            this.foros = foros;
          }
        });
      },
      error: (err) => console.error('Error al cargar foros', err)
    });
  }

  verPublicaciones(id: number): void {
    this.router.navigate(['/foros', id, 'publicaciones']);
  }

  editar(id: number): void {
    this.router.navigate(['/foros/editar', id]);
  }

  eliminar(id: number): void {
    if (confirm('Seguro que deseas eliminar este foro?')) {
      this.foroService.delete(id).subscribe({
        next: () => this.ngOnInit(),
        error: (err) => console.error('Error al eliminar', err)
      });
    }
  }

  obtenerNombreRol(): string {
    if (this.rol === 'ROLE_PACIENTE') return 'Paciente';
    if (this.rol === 'ROLE_FISIOTERAPEUTA') return 'Fisioterapeuta';
    if (this.rol === 'ROLE_ADMIN') return 'Administrador';
    return 'Usuario';
  }
}
