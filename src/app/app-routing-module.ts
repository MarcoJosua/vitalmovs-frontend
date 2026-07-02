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
import { ListFisioterapeutaComponent }    from './components/fisioterapeuta/list-fisioterapeuta/list-fisioterapeuta';
import { AddFisioterapeutaComponent }     from './components/fisioterapeuta/add-fisioterapeuta/add-fisioterapeuta';
import { EditFisioterapeutaComponent }    from './components/fisioterapeuta/edit-fisioterapeuta/edit-fisioterapeuta';
import { BuscarFisioterapeutaComponent }  from './components/fisioterapeuta/buscar-fisioterapeuta/buscar-fisioterapeuta';
import { ListFisioDiscapacidadComponent } from './components/fisioterapeuta-discapacidad/list-fisio-discapacidad/list-fisio-discapacidad';
import { AddFisioDiscapacidadComponent }  from './components/fisioterapeuta-discapacidad/add-fisio-discapacidad/add-fisio-discapacidad';
import { Home } from './components/home/home';
import { ListForoComponent } from './components/foro/list-foro/list-foro';
import { AddForoComponent } from './components/foro/add-foro/add-foro';
import { ListPublicacionComponent } from './components/publicacion/list-publicacion/list-publicacion';
import { AddPublicacionComponent } from './components/publicacion/add-publicacion/add-publicacion';


const routes: Routes = [
  {path: "", component:Login},
  {path: "login", component:Login},
  {path: "home", component:Home, canActivate:[consultarGuard]},
  {path: "plan-rehabilitacion/list-planes", component:ListPlanes, canActivate:[consultarGuard]},
  {path: 'plan-rehabilitacion/agregar/:asignacionId', component: AddPlanes, canActivate:[grabarGuard]},
  {path: 'plan-rehabilitacion/editar/:planId', component: AddPlanes, canActivate:[grabarGuard]},
  {path: 'plan-rehabilitacion/:planId/plan-ejercicio', component: ListPlanesEjercicio, canActivate:[consultarGuard]},
  {path: 'plan-rehabilitacion/:planId/plan-ejercicio/agregar', component: AddPlanesEjercicio, canActivate:[grabarGuard]},
  {path: 'plan-rehabilitacion/:planId/plan-ejercicio/editar/:planEjercicioId', component: AddPlanesEjercicio, canActivate:[grabarGuard]},
  {path: 'plan-rehabilitacion/:planId/plan-ejercicio/:planEjercicioId/progreso', component: AddEstadistica, canActivate:[consultarGuard]},
  {path: 'plan-rehabilitacion/:planId/plan-ejercicio/:planEjercicioId/progreso/editar/:estadisticaId', component: AddEstadistica, canActivate:[consultarGuard]},
  {path: 'plan-rehabilitacion/:planId/estadistica', component: ListEstadistica, canActivate:[consultarGuard]},
  {path: 'tipo-discapacidad/list-tipos', component: ListTipoDiscapacidadComponent, canActivate:[consultarGuard]},
  {path: 'tipo-discapacidad/agregar', component: AddTipoDiscapacidadComponent, canActivate:[grabarGuard]},
  {path: 'tipo-discapacidad/editar/:tipoDiscapacidadId', component: AddTipoDiscapacidadComponent, canActivate:[grabarGuard]},
  {path: 'paciente/list-pacientes', component: ListPacienteComponent, canActivate:[consultarGuard]},
  {path: 'paciente/agregar', component: AddPacienteComponent, canActivate:[grabarGuard]},
  {path: 'paciente/editar/:pacienteId', component: AddPacienteComponent, canActivate:[grabarGuard]},
  {path: 'paciente/:pacienteId/discapacidad', component: ListPacienteDiscapacidadComponent, canActivate:[consultarGuard]},
  {path: 'paciente/:pacienteId/discapacidad/agregar', component: AddPacienteDiscapacidadComponent, canActivate:[grabarGuard]},
  {path: 'paciente/:pacienteId/discapacidad/editar/:pacienteDiscapacidadId', component: AddPacienteDiscapacidadComponent, canActivate:[grabarGuard]},
  {path: 'fisioterapeuta/list-fisioterapeutas', component: ListFisioterapeutaComponent, canActivate: [consultarGuard]},
  {path: 'fisioterapeuta/agregar', component: AddFisioterapeutaComponent, canActivate: [grabarGuard]},
  {path: 'fisioterapeuta/editar/:fisioterapeutaId', component: EditFisioterapeutaComponent, canActivate: [grabarGuard]},
  {path: 'fisioterapeuta/buscar', component: BuscarFisioterapeutaComponent, canActivate: [consultarGuard]},
  {path: 'fisioterapeuta/:fisioterapeutaId/discapacidad', component: ListFisioDiscapacidadComponent, canActivate: [consultarGuard]},
  {path: 'fisioterapeuta/:fisioterapeutaId/discapacidad/agregar', component: AddFisioDiscapacidadComponent, canActivate: [grabarGuard]},
  {path: 'foros/list-foros', component: ListForoComponent, canActivate: [consultarGuard]},
  {path: 'foros/agregar', component: AddForoComponent, canActivate: [grabarGuard]},
  {path: 'foros/editar/:foroId', component: AddForoComponent, canActivate: [grabarGuard]},
  {path: 'foros/:foroId/publicaciones', component: ListPublicacionComponent, canActivate: [consultarGuard]},
  {path: 'foros/:foroId/publicaciones/agregar', component: AddPublicacionComponent, canActivate: [grabarGuard]},
  {path: 'foros/:foroId/publicaciones/editar/:publicacionId', component: AddPublicacionComponent, canActivate: [grabarGuard]},


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
