import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducer';
import { Usuario } from 'src/app/models/usuario.model';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styles: [
  ]
})
export class NavbarComponent implements OnInit,OnDestroy {
  userSubscription: Subscription;
  usuario: Usuario = null;
  constructor(private store: Store<AppState>) { }

  ngOnInit(): void {

    this.userSubscription = this.store.select('user').subscribe( (user: any)  => {
      this.usuario = {...user.user};
    });
}


// Es  importante  desubscribirse  del store para  evitar  problema 
ngOnDestroy() {
this.userSubscription.unsubscribe();
}

}
