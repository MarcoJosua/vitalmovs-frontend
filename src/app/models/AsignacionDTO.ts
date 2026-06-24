export interface AsignacionDTO {
  id: number;
  mensaje: string;
  fecha: string;
  estado: string;
  pacienteId: number;
  fisioterapeutaId: number;
  planRehabilitacionId: number | null;
  nombrePaciente: string;
  nombreFisioterapeuta: string;
}