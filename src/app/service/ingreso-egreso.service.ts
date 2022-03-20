import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import 'firebase/firestore';
import { map } from 'rxjs/operators';
import { IngresoEgreso } from '../models/ingreso-egreso';
import { AuthService } from './auth.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class IngresoEgresoService {

  constructor(private firestore: AngularFirestore, private authService: AuthService) { }


//Firebase   almacena  una  colección  y  es  la  forma  de  almacenar  una nueva

  crearIngresoEgreso(ingresoEgreso: IngresoEgreso){
    const uid = this.authService.user.uid
   // console.log(`crearIngresoEgreso ${uid}    ${JSON.stringify(ingresoEgreso)}`);
    return this.firestore.doc(`${uid}/ingresos-egresos`)
    .collection('items')
    .add({...ingresoEgreso});
  }



 //  se  cambia  el  metodo  valueChange()  a  snapshotChanges()  para  tener  acceso al  id  
 //  y  reconstruir  un  nuevo objeto  añadiendo  el id 

  initIngresoEgresosListener(uid: string){
   return  this.firestore.collection(`${uid}/ingresos-egresos/items`)
    .snapshotChanges()
    .pipe(
      map( snapshop => { return snapshop.map( doc => 
        {
          const data: any = doc.payload.doc.data();
          return {
          uid: doc.payload.doc.id,
          descripcion: data.descripcion,
          monto: data.monto,
          tipo: data.tipo
        }}) })
    )
  }


  borrarIngresoEgresosListener(uiditem: string){
    const uid = this.authService.user.uid
    return  this.firestore.doc(`${uid}/ingresos-egresos/items/${uiditem}`).delete();
   }
  
}
