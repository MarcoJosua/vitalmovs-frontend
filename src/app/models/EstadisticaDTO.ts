export interface EstadisticaDTO {
  id: number;
  fecha: string;
  nivelDolor: number;
  nivelDificultad: number;
  repeticionesRealizadas: number;
  duracionRealizada: number;
  observacion: string;
  planEjercicioId: number;
}