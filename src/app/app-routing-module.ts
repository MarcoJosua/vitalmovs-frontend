import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListPlanes } from './components/plan-rehabilitacion/list-planes/list-planes';
import { AddPlanes } from './components/plan-rehabilitacion/add-planes/add-planes';
import { ListPlanesEjercicio } from './components/plan-ejercicio/list-planes-ejercicio/list-planes-ejercicio';
import { AddPlanesEjercicio } from './components/plan-ejercicio/add-planes-ejercicio/add-planes-ejercicio';
import { AddEstadistica } from './components/estadistica/add-estadistica/add-estadistica';
import { ListEstadistica } from './components/estadistica/list-estadistica/list-estadistica';
import { Login } from './components/login/login';
import { consultarGuard } from './guards/consultar-guard';
import { grabarGuard } from './guards/grabar-guard';

const routes: Routes = [
  {path: "", component:Login},
  {path: "login", component:Login},

  {path: "home", component:ListPlanes, canActivate:[consultarGuard]},
  {path: "plan-rehabilitacion/list-planes", component:ListPlanes, canActivate:[consultarGuard]},
  {path: 'plan-rehabilitacion/agregar/:asignacionId', component: AddPlanes, canActivate:[grabarGuard]},
  {path: 'plan-rehabilitacion/editar/:planId', component: AddPlanes, canActivate:[grabarGuard]},
  {path: 'plan-rehabilitacion/:planId/plan-ejercicio', component: ListPlanesEjercicio, canActivate:[consultarGuard]},
  {path: 'plan-rehabilitacion/:planId/plan-ejercicio/agregar', component: AddPlanesEjercicio, canActivate:[grabarGuard]},
  {path: 'plan-rehabilitacion/:planId/plan-ejercicio/editar/:planEjercicioId', component: AddPlanesEjercicio, canActivate:[grabarGuard]},
  {path: 'plan-rehabilitacion/:planId/plan-ejercicio/:planEjercicioId/progreso', component: AddEstadistica, canActivate:[consultarGuard]},
  {path: 'plan-rehabilitacion/:planId/plan-ejercicio/:planEjercicioId/progreso/editar/:estadisticaId', component: AddEstadistica, canActivate:[consultarGuard]},
  {path: 'plan-rehabilitacion/:planId/estadistica', component: ListEstadistica, canActivate:[consultarGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
