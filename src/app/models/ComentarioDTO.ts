export interface Comentario {
  id?: number;
  contenido: string;
  fechaComentario?: string;
  publicacionId: number;
  pacienteId: number;
}
