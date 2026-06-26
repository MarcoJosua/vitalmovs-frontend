import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UserService } from '../../services/user-service';
import { UserDTO } from '../../models/userDTO';
import { TokenDTO } from '../../models/tokenDTO';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {



  loginForm!: FormGroup;

  constructor (private userService:UserService, private snackBar: MatSnackBar,
                 private formBuilder: FormBuilder,
                private router:Router){} 

  
   ngOnInit(){
    
    this.loginForm = this.formBuilder.group(
      {
            password:["",[Validators.required]],
            username:["",[Validators.required]]            
      }
    );    

   }


  Login(){

    const userDTO:UserDTO={
      id:0,
      username:this.loginForm.get("username")?.value,
      password:this.loginForm.get("password")?.value,
      authorities:""
    }

    this.userService.login(userDTO).subscribe({
      next:(data:TokenDTO)=>{
        console.log(data);
        this.router.navigate(["/home"]);
        this.snackBar.open("Se autorizó el ingreso","",{duration: 2000});
      },      
      error:(err)=>{
        console.log(err);
      }
    })
  }

}