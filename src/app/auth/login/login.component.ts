import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducer';
import { AuthService } from 'src/app/service/auth.service';
import Swal from 'sweetalert2';
import * as ui from '../../shared/ui.actions';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent implements OnInit,OnDestroy {
  loginForm!: FormGroup;
  cargando: boolean = false;
  uiSubscription: Subscription;
  constructor(private fb: FormBuilder, 
              private auth: AuthService, 
              private router: Router,
              private store: Store<AppState>) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      correo: ['',[Validators.required,Validators.email]],
      password: ['',Validators.required],
    });
    // Me  subscribo  al  store  seleccionando  solo  el  "ui"
    // y  asigno  el  valor  del store  en  la  variable  this.cargando
    this.uiSubscription = this.store.select('ui').subscribe( ui => {
      this.cargando = ui.isLoading;
      console.log('cargando subs  Login ');
    });
}


// Es  importante  desubscribirse  del store para  evitar  problema 
ngOnDestroy() {
  if(this.uiSubscription != null) this.uiSubscription.unsubscribe();
}


  loginUsuario(){
    if(this.loginForm.invalid) return;
    const {correo, password} = this.loginForm.value;
    // Hago  el  dispatch  con  isLoading para  empezar  el Loading
    this.store.dispatch( ui.isLoading() );
    this.auth.loginUsuario(correo,password)
      .then(credenciales => { 
        console.log(credenciales);
        // Hago  el  dispatch  con  stopLoading para cerrar  el Loading
        this.store.dispatch( ui.stopLoading() );
        this.router.navigate(['/']);
      })
      .catch( err => {
        console.error(err);
        // Hago  el  dispatch  con  stopLoading para cerrar  el Loading
        this.store.dispatch( ui.stopLoading());
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: err.message,
          footer: '<a href="">Why do I have this issue?</a>'
        })
      })
  }

}
