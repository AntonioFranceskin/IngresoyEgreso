import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import 'firebase/firestore';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map } from 'rxjs/operators';
import { Usuario } from '../models/usuario.model';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import * as authActions from '../auth/auth.actions';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userSubscription: Subscription;

  constructor(
    public auth: AngularFireAuth, 
    public firestore: AngularFirestore, 
    private store: Store<AppState>) { }

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

  initAuthListener() {
    this.auth.authState.subscribe( fuser => {
      if ( fuser ) {
        // existe
        this.userSubscription = this.firestore.doc(`${ fuser.uid }/usuario`).valueChanges()
          .subscribe( (firestoreUser: any) => {
            console.log(`Metodo initAuthListener1  ${JSON.stringify(firestoreUser)}`);
            const user = Usuario.fromFirebase( firestoreUser );
            console.log(`Metodo initAuthListener2  ${JSON.stringify(user)}`);
            this.store.dispatch( authActions.setUser({ user }) );
          })
      } else {
        // no existe
        this.userSubscription.unsubscribe();
        this.store.dispatch( authActions.unSetUser() );
      }
    });
  }

  isAuth(){
    return this.auth.authState.pipe(
      map(fbUser => fbUser != null)
    )
  }
}
