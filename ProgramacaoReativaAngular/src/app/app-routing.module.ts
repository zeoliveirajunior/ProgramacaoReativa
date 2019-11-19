import { LoginComponent } from './login/login.component';
import { DebounceComponent } from './debounce/debounce.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'debounce', pathMatch: 'full' },
  { path: 'debounce', component: DebounceComponent },
  { path: 'login', component: LoginComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
