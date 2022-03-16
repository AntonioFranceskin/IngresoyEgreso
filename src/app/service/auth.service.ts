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
import * as ingresoegresoActions from '../ingreso-egreso/ingreso-egreso.actions';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userSubscription: Subscription;
  user1Subscription: Subscription;
  private _user: Usuario;

  get user(){ return this._user; }
  
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
    this._user = null;
    this.store.dispatch( authActions.unSetUser()  );
    this.store.dispatch( ingresoegresoActions.unSetItems() );
    if(this.userSubscription != null) this.userSubscription.unsubscribe();
    return this.auth.signOut();
  }

  initAuthListener() {
    this.user1Subscription = this.store.select('user').subscribe( user1 => {
      console.log(`Justo antes  de  initAuthListener  ${JSON.stringify(user1)}`);
    });



    this.auth.authState.subscribe( fuser => {
      console.log(fuser);
      if ( fuser ) {
        console.log("Existe");
        this.userSubscription = this.firestore.doc(`${ fuser.uid }/usuario`).valueChanges()
          .subscribe( (firestoreUser: any) => {
            const user = Usuario.fromFirebase( firestoreUser );
            this._user = user;
            this.store.dispatch( authActions.setUser({ user }) );
          })
      } else {
        console.log("No existe");
        this._user = null;
        this.store.dispatch( authActions.unSetUser()  );
        this.store.dispatch( ingresoegresoActions.unSetItems() );
        if(this.userSubscription != null) this.userSubscription.unsubscribe();
      }
    });
  }

  isAuth(){
    return this.auth.authState.pipe(
      map(fbUser => fbUser != null)
    )
  }
}
