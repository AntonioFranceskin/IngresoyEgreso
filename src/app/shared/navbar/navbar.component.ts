import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducer';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styles: [
  ]
})
export class NavbarComponent implements OnInit,OnDestroy {
  userSubscription: Subscription;
  userLogeado: string = null;
  constructor(private store: Store<AppState>) { }

  ngOnInit(): void {

    this.userSubscription = this.store.select('user').subscribe( (user: any)  => {
      const usuario = {...user.user};
      this.userLogeado = usuario.email;
    });
}


// Es  importante  desubscribirse  del store para  evitar  problema 
ngOnDestroy() {
this.userSubscription.unsubscribe();
}

}
