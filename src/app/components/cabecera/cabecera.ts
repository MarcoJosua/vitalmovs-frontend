import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user-service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-cabecera',
  standalone: false,
  templateUrl: './cabecera.html',
  styleUrl: './cabecera.css',
})
export class Cabecera implements OnInit {

  rol: string = '';

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarRol();

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.cargarRol();
      });
  }

  cargarRol(): void {
    this.rol = this.userService.getAuthoritiesLogeado();
    console.log('ROL EN CABECERA:', this.rol);
  }

  Logout(): void {
    this.userService.logout();
    this.rol = '';
    this.router.navigate(['/login']);
  }
}