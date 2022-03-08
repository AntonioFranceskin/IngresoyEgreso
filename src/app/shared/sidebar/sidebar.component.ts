import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducer';
import { Usuario } from 'src/app/models/usuario.model';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [
  ]
})
export class SidebarComponent implements OnInit {
  userSubscription: Subscription;
  userLogeado: string = null;
  constructor( private auth: AuthService, private router: Router, private store: Store<AppState>) { }

  ngOnInit(): void {
    this.userSubscription = this.store.select('user').subscribe( (user: any)  => {
      const usuario: Usuario = {...user.user};
      this.userLogeado = usuario.nombre;
    });
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
    }
    


  logout(){
    this.auth.logout()
    .then(() => {
      this.router.navigate(['/login']);
    })
    .catch(err => {
      console.log(err);
    })
  }

}
