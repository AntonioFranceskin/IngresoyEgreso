import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducer';
import { IngresoEgreso } from 'src/app/models/ingreso-egreso';
import { IngresoEgresoService } from 'src/app/service/ingreso-egreso.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styles: [
  ]
})
export class DetalleComponent implements OnInit, OnDestroy{
  ingresoEgresos: IngresoEgreso[] = [];
  constructor(private store: Store<AppState>,
    private ingresoegresoServices: IngresoEgresoService) { }
  ingresosegresosSubscription: Subscription;

  ngOnInit(): void {
    this.ingresosegresosSubscription = this.store.select('ingresoEgreso').subscribe( ({items}) => {
     //console.log("justo antes  de DetalleComponent ");
     //console.log(items);
      this.ingresoEgresos = items;
    })
  }

  ngOnDestroy() {
    if(this.ingresosegresosSubscription != null) this.ingresosegresosSubscription.unsubscribe();
  }

  borrar(uidItem: string){
    //console.log(uidItem);
    this.ingresoegresoServices.borrarIngresoEgresosListener(uidItem)
    .then( () => { Swal.fire('Registro borrado' , 'success');})
    .catch( (err) => {   Swal.fire('Error', err.message, 'error');})
  }


}
