import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListPlanes } from './components/plan-rehabilitacion/list-planes/list-planes';
import { AddPlanes } from './components/plan-rehabilitacion/add-planes/add-planes';

const routes: Routes = [
  {path: "", component:ListPlanes},
  {path: "plan-rehabilitacion/list-planes", component:ListPlanes},
  {path: 'plan-rehabilitacion/agregar/:asignacionId', component: AddPlanes },
  {path: 'plan-rehabilitacion/editar/:planId', component: AddPlanes },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
