import { LoginserviceService } from "./loginservice.service";
import { Component, OnInit, OnDestroy, NgZone } from "@angular/core";
import { Observer, Subscription } from "rxjs";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit, OnDestroy {
  // Serviço de login
  Login: LoginserviceService;

  // Subscription para o login
  SubscriptionRealizandoLogin: Subscription;

  // Variaveis de bind da tela
  Usuario;
  Senha;
  StringIniciandoLogin;
  ErroRealizarLogin;

  constructor(Login: LoginserviceService, private Zone: NgZone) {
    this.Login = Login;
  }

  ngOnInit() {}

  IniciarLogin(Usuario, Senha) {
    this.StringIniciandoLogin = "Iniciando o processo de login...";
    this.ErroRealizarLogin = null;
    this.SubscriptionRealizandoLogin = this.Login.DoLogin(
      Usuario,
      Senha
    ).subscribe(
      User => {
        console.log(User);
        this.Zone.run(() => {
          this.StringIniciandoLogin = "Login realizado com sucesso";
        });
      },
      Erro => {
        this.Zone.run(() => {
          console.log(Erro);
          this.ErroRealizarLogin = Erro.message ? Erro.message : Erro;
        });
      }
    );
  }

  CancelarLogin() {
    if (this.SubscriptionRealizandoLogin)
      this.SubscriptionRealizandoLogin.unsubscribe();
    this.Login.TentativaLogin.next(false);
  }

  ngOnDestroy(): void {
    this.CancelarLogin();
  }
}
