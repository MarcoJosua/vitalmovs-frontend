import { Component } from '@angular/core';
import { UserService } from '../../services/user-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cabecera',
  standalone: false,
  templateUrl: './cabecera.html',
  styleUrl: './cabecera.css',
})

export class Cabecera {
  constructor (private userService:UserService, private router:Router){}
  Logout(){
    this.userService.logout();
    this.router.navigate(["/login"]);
  }
}