export interface Publicacion {
  id?: number;
  titulo: string;
  contenido: string;
  fechaPublicacion?: string;
  foroId: number;
  pacienteId: number;
}
