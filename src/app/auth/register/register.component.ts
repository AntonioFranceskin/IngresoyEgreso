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
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [
  ]
})
export class RegisterComponent implements OnInit,OnDestroy {
  registroForm!: FormGroup;
  cargando: boolean = false;
  uiSubscription: Subscription;

  constructor(
    private fb: FormBuilder, 
    private auth: AuthService, 
    private router: Router,
    private store: Store<AppState>) { }

  ngOnInit(): void {
    this.registroForm = this.fb.group({
      nombre: ['',Validators.required],
      correo: ['',[Validators.required,Validators.email]],
      password: ['',Validators.required],
    });
    this.uiSubscription = this.store.select('ui').subscribe( ui => {
      this.cargando = ui.isLoading;
      console.log('cargando subs Register');
    });
  }

  ngOnDestroy() {
    if(this.uiSubscription != null) this.uiSubscription.unsubscribe();
    }

  crearUsuario(){
    if(this.registroForm.invalid) return;
    const {nombre, correo, password} = this.registroForm.value;
    this.store.dispatch( ui.isLoading() );
    this.auth.crearUsuario(nombre,correo,password)
      .then(credenciales => { 
        this.store.dispatch( ui.stopLoading() );
        console.log(credenciales);
        this.router.navigate(['/']);
      })
      .catch( err => {
        console.error(err);
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
