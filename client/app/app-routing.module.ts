import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent }   from './dashboard/dashboard.component';
import { SpotsComponent }       from './spots/spots.component';
import { SpotDetailComponent }  from './spot-detail/spot-detail.component';
import { AuthGuard }            from "./guards/auth.guard";

const routes: Routes = [
  { path: '', redirectTo: '/spots', pathMatch: 'full' },
  { path: 'dashboard',  component: DashboardComponent },
  { path: 'detail/:id', component: SpotDetailComponent },
  { path: 'spots',     component: SpotsComponent },

  // otherwise redirect to home
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
