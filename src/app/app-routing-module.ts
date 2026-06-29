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
import { ListTipoDiscapacidadComponent } from './components/tipo-discapacidad/list-tipo-discapacidad/list-tipo-discapacidad';
import { AddTipoDiscapacidadComponent } from './components/tipo-discapacidad/add-tipo-discapacidad/add-tipo-discapacidad';
import { ListPacienteComponent } from './components/paciente/list-paciente/list-paciente';
import { AddPacienteComponent } from './components/paciente/add-paciente/add-paciente';
import { ListPacienteDiscapacidadComponent } from './components/paciente-discapacidad/list-paciente-discapacidad/list-paciente-discapacidad';
import { AddPacienteDiscapacidadComponent } from './components/paciente-discapacidad/add-paciente-discapacidad/add-paciente-discapacidad';
import { ListFisioterapeutaComponent }    from './components/fisioterapeuta/list-fisioterapeuta/list-fisioterapeuta.component';
import { AddFisioterapeutaComponent }     from './components/fisioterapeuta/add-fisioterapeuta/add-fisioterapeuta.component';
import { EditFisioterapeutaComponent }    from './components/fisioterapeuta/edit-fisioterapeuta/edit-fisioterapeuta.component';
import { BuscarFisioterapeutaComponent }  from './components/fisioterapeuta/buscar-fisioterapeuta/buscar-fisioterapeuta.component';
import { ListFisioDiscapacidadComponent } from './components/fisioterapeuta-discapacidad/list-fisio-discapacidad/list-fisio-discapacidad.component';
import { AddFisioDiscapacidadComponent }  from './components/fisioterapeuta-discapacidad/add-fisio-discapacidad/add-fisio-discapacidad.component';


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
  {path: 'tipo-discapacidad/list-tipos', component: ListTipoDiscapacidad, canActivate:[consultarGuard]},
  {path: 'tipo-discapacidad/agregar', component: AddTipoDiscapacidad, canActivate:[grabarGuard]},
  {path: 'tipo-discapacidad/editar/:tipoDiscapacidadId', component: AddTipoDiscapacidad, canActivate:[grabarGuard]},
  {path: 'paciente/list-pacientes', component: ListPaciente, canActivate:[consultarGuard]},
  {path: 'paciente/agregar', component: AddPaciente, canActivate:[grabarGuard]},
  {path: 'paciente/editar/:pacienteId', component: AddPaciente, canActivate:[grabarGuard]},
  {path: 'paciente/:pacienteId/discapacidad', component: ListPacienteDiscapacidad, canActivate:[consultarGuard]},
  {path: 'paciente/:pacienteId/discapacidad/agregar', component: AddPacienteDiscapacidad, canActivate:[grabarGuard]},
  {path: 'paciente/:pacienteId/discapacidad/editar/:pacienteDiscapacidadId', component: AddPacienteDiscapacidad, canActivate:[grabarGuard]},
  {path: 'fisioterapeuta/list-fisioterapeutas', component: ListFisioterapeutaComponent, canActivate: [consultarGuard]},
  {path: 'fisioterapeuta/agregar', component: AddFisioterapeutaComponent, canActivate: [grabarGuard]},
  {path: 'fisioterapeuta/editar/:fisioterapeutaId', component: EditFisioterapeutaComponent, canActivate: [grabarGuard]},
  {path: 'fisioterapeuta/buscar', component: BuscarFisioterapeutaComponent, canActivate: [consultarGuard]},
  {path: 'fisioterapeuta/:fisioterapeutaId/discapacidad', component: ListFisioDiscapacidadComponent, canActivate: [consultarGuard]},
  {path: 'fisioterapeuta/:fisioterapeutaId/discapacidad/agregar', component: AddFisioDiscapacidadComponent, canActivate: [grabarGuard]},


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
