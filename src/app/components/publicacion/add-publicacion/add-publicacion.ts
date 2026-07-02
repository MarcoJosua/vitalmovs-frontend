import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Publicacion } from '../../../models/PublicacionDTO';
import { PublicacionService } from '../../../services/publicacion-service';
import { UserService } from '../../../services/user-service';
import { PacienteService } from '../../../services/paciente-services';

@Component({
  selector: 'app-add-publicacion',
  templateUrl: './add-publicacion.html',
  standalone: false,
  styleUrls: ['./add-publicacion.css']
})
export class AddPublicacionComponent implements OnInit {

  publicacion: Publicacion = {
    titulo: '',
    contenido: '',
    foroId: 0,
    pacienteId: 0
  };

  editando: boolean = false;

  constructor(
    private publicacionService: PublicacionService,
    private userService: UserService,
    private pacienteService: PacienteService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const foroId = this.route.snapshot.paramMap.get('foroId');
    if (foroId) {
      this.publicacion.foroId = Number(foroId);
    }

    const userId = Number(this.userService.getIdLogeado());
    this.pacienteService.findByUserId(userId).subscribe({
      next: (paciente) => {
        this.publicacion.pacienteId = paciente.id;
      },
      error: (err) => console.error('Error al obtener paciente', err)
    });

    const publicacionId = this.route.snapshot.paramMap.get('publicacionId');
    if (publicacionId) {
      this.editando = true;
      this.publicacionService.listByForoId(this.publicacion.foroId).subscribe({
        next: (data) => {
          const encontrado = data.find(p => p.id === Number(publicacionId));
          if (encontrado) {
            this.publicacion = encontrado;
          }
        },
        error: (err) => console.error('Error al cargar publicacion', err)
      });
    }
  }

  guardar(): void {
    if (this.editando) {
      this.publicacionService.update(this.publicacion).subscribe({
        next: () => this.router.navigate(['/foros', this.publicacion.foroId, 'publicaciones']),
        error: (err) => console.error('Error al actualizar', err)
      });
    } else {
      this.publicacionService.add(this.publicacion).subscribe({
        next: () => this.router.navigate(['/foros', this.publicacion.foroId, 'publicaciones']),
        error: (err) => console.error('Error al guardar', err)
      });
    }
  }

  cancelar(): void {
    this.router.navigate(['/foros', this.publicacion.foroId, 'publicaciones']);
  }
}
