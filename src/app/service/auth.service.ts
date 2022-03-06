import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import 'firebase/firestore';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map } from 'rxjs/operators';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public auth: AngularFireAuth, public firestore: AngularFirestore) { }

  crearUsuario(nombre:string, email:string, password:string){
    //console.log({nombre, email, password});
    return this.auth.createUserWithEmailAndPassword(email,password)
               .then( ({user}) => {
                 const newUser  = new Usuario(user.uid, nombre, email);
                 // Es  muy  importante  enviar  la  data  a Firebase  desestructurado
                return this.firestore.doc(`${user.uid}/usuario`).set({...newUser})
               })
  }

  loginUsuario(email:string, password:string){
    //console.log({nombre, email, password});
    return this.auth.signInWithEmailAndPassword(email,password);
  }

  logout(){
    return this.auth.signOut();
  }

  initAuthListener(){
    this.auth.authState.subscribe(fuser => {
      console.log(fuser);
    })
  }

  isAuth(){
    return this.auth.authState.pipe(
      map(fbUser => fbUser != null)
    )
  }



}
