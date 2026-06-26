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
  ],
  imports: [BrowserModule, AppRoutingModule, MaterialModule, FormsModule, ReactiveFormsModule, HttpClientModule],
  providers: [provideBrowserGlobalErrorListeners(), provideNativeDateAdapter(), provideHttpClient(withInterceptors([autorizacionInterceptor]))],
  bootstrap: [App],
})
export class AppModule {}
