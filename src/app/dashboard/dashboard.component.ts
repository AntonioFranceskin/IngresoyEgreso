import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AppState } from '../app.reducer';
import  *  as accion  from '../ingreso-egreso/ingreso-egreso.actions';
import { AuthService } from '../service/auth.service';
import { IngresoEgresoService } from '../service/ingreso-egreso.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [
  ]
})
export class DashboardComponent implements OnInit,OnDestroy {
  userSubs: Subscription;
  igresoegresoSubs: Subscription;
  constructor(
    private  store: Store<AppState>,  
    private auth: AuthService,
    private ingresoEgresoService: IngresoEgresoService) { }

  ngOnInit(): void {
    this.auth.initAuthListener();
    this.userSubs = this.store.select('user')
    .pipe(filter( auth => auth.user != null))
    .subscribe(({user}) =>{
      //console.log(`Dasborad ${JSON.stringify(user)}`);
      this.igresoegresoSubs = this.ingresoEgresoService.initIngresoEgresosListener(user.uid).subscribe(ingresoegresosFB =>  {
       // console.log("dentro de dashboard");
       // console.log(ingresoegresosFB);
        this.store.dispatch(accion.setItems({items: ingresoegresosFB}) )
      })
    })
  }

  ngOnDestroy() {
   // console.log("ngOnDestroy de Dashboard");
    this.auth.initAuthListener();
    if(this.userSubs != null) this.userSubs.unsubscribe();
    if(this.igresoegresoSubs != null) this.igresoegresoSubs.unsubscribe();
  }

}
