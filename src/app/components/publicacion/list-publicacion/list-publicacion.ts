import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Publicacion } from '../../../models/PublicacionDTO';
import { Comentario } from '../../../models/ComentarioDTO';
import { PublicacionService } from '../../../services/publicacion-service';
import { ComentarioService } from '../../../services/comentario-service';
import { UserService } from '../../../services/user-service';
import { PacienteService } from '../../../services/paciente-services';

@Component({
  selector: 'app-list-publicacion',
  templateUrl: './list-publicacion.html',
  standalone: false,
  styleUrls: ['./list-publicacion.css']
})
export class ListPublicacionComponent implements OnInit {

  foroId!: number;
  publicaciones: Publicacion[] = [];
  comentarios: { [key: number]: Comentario[] } = {};
  nuevoComentario: { [key: number]: string } = {};
  mostrarComentarios: { [key: number]: boolean } = {};
  rol: string = '';
  pacienteId: number = 0;

  constructor(
    private publicacionService: PublicacionService,
    private comentarioService: ComentarioService,
    private userService: UserService,
    private pacienteService: PacienteService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.rol = this.userService.getAuthoritiesLogeado().trim();
    const userId = Number(this.userService.getIdLogeado());
    this.pacienteService.findByUserId(userId).subscribe({
      next: (paciente) => {
        this.pacienteId = paciente.id;
      },
      error: (err) => console.error('Error al obtener paciente', err)
    });
    this.foroId = Number(this.route.snapshot.paramMap.get('foroId'));
    this.cargarPublicaciones();
  }

  cargarPublicaciones(): void {
    this.publicacionService.listByForoId(this.foroId).subscribe({
      next: (data) => {
        this.publicaciones = data;
        this.cdr.detectChanges();
        this.publicaciones.forEach(p => {
          if (p.id) {
            this.cargarComentarios(p.id);
          }
        });
      },
      error: (err) => console.error('Error al cargar publicaciones', err)
    });
  }

  cargarComentarios(publicacionId: number): void {
    this.comentarioService.listByPublicacionId(publicacionId).subscribe({
      next: (data) => {
        this.comentarios[publicacionId] = data;
      },
      error: (err) => console.error('Error al cargar comentarios', err)
    });
  }

  toggleComentarios(publicacionId: number): void {
    this.mostrarComentarios[publicacionId] = !this.mostrarComentarios[publicacionId];
  }

  agregarComentario(publicacionId: number): void {
    const contenido = this.nuevoComentario[publicacionId];
    if (!contenido || contenido.trim() === '') return;

    const comentario: Comentario = {
      contenido: contenido,
      publicacionId: publicacionId,
      pacienteId: this.pacienteId
    };

    this.comentarioService.add(comentario).subscribe({
      next: () => {
        this.nuevoComentario[publicacionId] = '';
        this.cargarComentarios(publicacionId);
      },
      error: (err) => console.error('Error al agregar comentario', err)
    });
  }

  eliminarComentario(comentarioId: number, publicacionId: number): void {
    if (confirm('Eliminar este comentario?')) {
      this.comentarioService.delete(comentarioId).subscribe({
        next: () => this.cargarComentarios(publicacionId),
        error: (err) => console.error('Error al eliminar comentario', err)
      });
    }
  }

  editarPublicacion(id: number): void {
    this.router.navigate(['/foros', this.foroId, 'publicaciones', 'editar', id]);
  }

  eliminarPublicacion(id: number): void {
    if (confirm('Seguro que deseas eliminar esta publicacion?')) {
      this.publicacionService.delete(id).subscribe({
        next: () => this.cargarPublicaciones(),
        error: (err) => console.error('Error al eliminar', err)
      });
    }
  }

  volver(): void {
    this.router.navigate(['/foros/list-foros']);
  }
}
