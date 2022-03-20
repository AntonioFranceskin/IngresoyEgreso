import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { dashboardRoutes } from './dashboard.routes';
import { RouterModule, Routes } from '@angular/router';

const rutasHijas: Routes = [
   {path: '', component: DashboardComponent,children: dashboardRoutes, // canActivate: [AuthGuard]
   },
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(rutasHijas)
  ],
  exports: [
    RouterModule
  ]
})
export class DashboardRoutersModule { }
