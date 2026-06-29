import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { MaterialModule } from './modules/material/material-module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Cabecera } from './components/cabecera/cabecera';
import { ListPlanes } from './components/plan-rehabilitacion/list-planes/list-planes';
import { AddPlanes } from './components/plan-rehabilitacion/add-planes/add-planes';
import { provideNativeDateAdapter } from '@angular/material/core';
import { ListPlanesEjercicio } from './components/plan-ejercicio/list-planes-ejercicio/list-planes-ejercicio';
import { AddPlanesEjercicio } from './components/plan-ejercicio/add-planes-ejercicio/add-planes-ejercicio';
import { AddEstadistica } from './components/estadistica/add-estadistica/add-estadistica';
import { ListEstadistica } from './components/estadistica/list-estadistica/list-estadistica';
import { Login } from './components/login/login';
import { HttpClientModule, provideHttpClient, withInterceptors } from '@angular/common/http';
import { autorizacionInterceptor } from './interceptors/autorizacion-interceptor';
import { AddTipoDiscapacidadComponent } from './components/tipo-discapacidad/add-tipo-discapacidad/add-tipo-discapacidad';
import { ListTipoDiscapacidadComponent } from './components/tipo-discapacidad/list-tipo-discapacidad/list-tipo-discapacidad';
import { AddPacienteComponent } from './components/paciente/add-paciente/add-paciente';
import { ListPacienteComponent } from './components/paciente/list-paciente/list-paciente';
import { AddPacienteDiscapacidadComponent } from './components/paciente-discapacidad/add-paciente-discapacidad/add-paciente-discapacidad';
import { ListPacienteDiscapacidadComponent } from './components/paciente-discapacidad/list-paciente-discapacidad/list-paciente-discapacidad';
import { ListFisioterapeutaComponent } from './components/fisioterapeuta/list-fisioterapeuta/list-fisioterapeuta.component';
import { AddFisioterapeutaComponent } from './components/fisioterapeuta/add-fisioterapeuta/add-fisioterapeuta.component'; 
import { EditFisioterapeutaComponent } from './components/fisioterapeuta/edit-fisioterapeuta/edit-fisioterapeuta.component'; 
import { BuscarFisioterapeutaComponent } from './components/fisioterapeuta/buscar-fisioterapeuta/buscar-fisioterapeuta.component';
import { ListFisioDiscapacidadComponent } from './components/fisioterapeuta-discapacidad/list-fisio-discapacidad/list-fisio-discapacidad.component'; 
import { AddFisioDiscapacidadComponent } from './components/fisioterapeuta-discapacidad/add-fisio-discapacidad/add-fisio-discapacidad.component';

@NgModule({
  declarations: [
    App,
    Cabecera,
    ListPlanes,
    AddPlanes,
    ListPlanesEjercicio,
    AddPlanesEjercicio,
    AddEstadistica,
    ListEstadistica,
    Login,
    AddTipoDiscapacidadComponent,
    ListTipoDiscapacidadComponent,
    AddPacienteComponent,
    ListPacienteComponent,
    AddPacienteDiscapacidadComponent,
    ListPacienteDiscapacidadComponent,
    ListFisioterapeutaComponent,
    AddFisioterapeutaComponent,
    EditFisioterapeutaComponent,
    BuscarFisioterapeutaComponent,
    ListFisioDiscapacidadComponent,
    AddFisioDiscapacidadComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, MaterialModule, FormsModule, ReactiveFormsModule, HttpClientModule],
  providers: [provideBrowserGlobalErrorListeners(), provideNativeDateAdapter(), provideHttpClient(withInterceptors([autorizacionInterceptor]))],
  bootstrap: [App],
})
export class AppModule {}
