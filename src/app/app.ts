import { Component, signal } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('vitalmovs-frontend');
  mostrarNavbar = false;

  // Rutas donde NO debe aparecer el navbar
  private rutasSinNavbar = ['/login', '/registro-usuario', '/'];

  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      const url = event.urlAfterRedirects;
      this.mostrarNavbar = !this.rutasSinNavbar.includes(url) &&
                           !url.startsWith('/fisioterapeuta/agregar');
    });
  }
}
