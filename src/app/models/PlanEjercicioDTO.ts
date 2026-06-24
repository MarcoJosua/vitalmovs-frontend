export interface PlanEjercicioDTO {
  id: number;
  series: number;
  repeticiones: number;
  duracionRecomendada: number;
  diaSemana: string;
  orden: number;
  planRehabilitacionId: number;
  ejercicioId: number;
}