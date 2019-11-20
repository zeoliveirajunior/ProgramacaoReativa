import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { DebounceComponent } from "./debounce/debounce.component";
import { LoginComponent } from "./login/login.component";
import { HttpClientModule } from "@angular/common/http";
import { LoginexternoComponent } from './login/loginexterno/loginexterno.component';
import { OperadoresComponent } from './operadores/operadores.component';

@NgModule({
  declarations: [AppComponent, DebounceComponent, LoginComponent, LoginexternoComponent, OperadoresComponent],
  imports: [
    FormsModule,
    CommonModule,
    BrowserModule, AppRoutingModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
