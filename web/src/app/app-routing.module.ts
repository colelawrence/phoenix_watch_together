import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// import { RouteUndefinedComponent } from './route-undefined/route-undefined.component';

export const routes: Routes = [
  // TODO Redirect based on device state
  { path: '', redirectTo: 'login', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
