import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IngresoEgreso } from '../models/ingreso-egreso';
import { IngresoEgresoService } from '../service/ingreso-egreso.service';
import Swal from 'sweetalert2';
import { AppState } from '../app.reducer';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import * as ui from '../shared/ui.actions';

@Component({
  selector: 'app-ingreso-egreso',
  templateUrl: './ingreso-egreso.component.html',
  styles: [
  ]
})
export class IngresoEgresoComponent implements OnInit,OnDestroy {
  ingresoForm: FormGroup;
  tipo: string = 'ingreso';
  cargando: boolean = false;
  uiSubscription: Subscription;

  constructor(private fb: FormBuilder, 
    private ingresoEgresoService: IngresoEgresoService,
    private store: Store<AppState>) { }

  ngOnInit(): void {
    this.ingresoForm = this.fb.group({
      descripcion:  ['', Validators.required],
      monto: ['',Validators.required],

    })
    this.uiSubscription = this.store.select('ui').subscribe( ui => {
      this.cargando = ui.isLoading;
      console.log('cargando subs  Login ');
    });
  }

  ngOnDestroy() {
    if(this.uiSubscription != null) this.uiSubscription.unsubscribe();
  }

  guardar(){
    if(this.ingresoForm.invalid) return;
    this.store.dispatch( ui.isLoading() );
    console.log(this.ingresoForm.value);
    console.log(this.tipo);
    const {descripcion, monto} = this.ingresoForm.value;
    const ingresoEgreso =  new IngresoEgreso(descripcion, monto, this.tipo, null);
    this.ingresoEgresoService.crearIngresoEgreso(ingresoEgreso)
    .then(() => {
      Swal.fire('Registro creado', descripcion, 'success');
      this.store.dispatch( ui.stopLoading() );
      this.ingresoForm.reset();
    })
    .catch(err => {
      Swal.fire('Error', err.message, 'error');
      this.store.dispatch( ui.stopLoading() );
    })

  }

}
