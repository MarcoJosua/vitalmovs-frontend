import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListPlanes } from './components/plan-rehabilitacion/list-planes/list-planes';
import { AddPlanes } from './components/plan-rehabilitacion/add-planes/add-planes';
import { ListPlanesEjercicio } from './components/plan-ejercicio/list-planes-ejercicio/list-planes-ejercicio';
import { AddPlanesEjercicio } from './components/plan-ejercicio/add-planes-ejercicio/add-planes-ejercicio';
import { AddEstadistica } from './components/estadistica/add-estadistica/add-estadistica';
import { ListEstadistica } from './components/estadistica/list-estadistica/list-estadistica';

const routes: Routes = [
  {path: "", component:ListPlanes},
  {path: "plan-rehabilitacion/list-planes", component:ListPlanes},
  {path: 'plan-rehabilitacion/agregar/:asignacionId', component: AddPlanes },
  {path: 'plan-rehabilitacion/editar/:planId', component: AddPlanes },
  {path: 'plan-rehabilitacion/:planId/plan-ejercicio', component: ListPlanesEjercicio },
  {path: 'plan-rehabilitacion/:planId/plan-ejercicio/agregar', component: AddPlanesEjercicio },
  {path: 'plan-rehabilitacion/:planId/plan-ejercicio/editar/:planEjercicioId', component: AddPlanesEjercicio },
  {path: 'plan-rehabilitacion/:planId/plan-ejercicio/:planEjercicioId/progreso',component: AddEstadistica},
  {path: 'plan-rehabilitacion/:planId/plan-ejercicio/:planEjercicioId/progreso/editar/:estadisticaId',component: AddEstadistica},
  {path: 'plan-rehabilitacion/:planId/estadistica',component: ListEstadistica}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
