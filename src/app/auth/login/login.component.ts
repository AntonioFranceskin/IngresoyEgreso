import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      correo: ['',[Validators.required,Validators.email]],
      password: ['',Validators.required],
    });
  }

  loginUsuario(){
    if(this.loginForm.invalid) return;
    const {correo, password} = this.loginForm.value;
    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text: 'Por favor espere...'
    });
    Swal.showLoading();
    
    this.auth.loginUsuario(correo,password)
      .then(credenciales => { 
        console.log(credenciales);
        Swal.close();
        this.router.navigate(['/']);
      })
      .catch( err => {
        console.error(err);
        Swal.close();
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: err.message,
          footer: '<a href="">Why do I have this issue?</a>'
        })
      })
  }

}
