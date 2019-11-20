import { Injectable, NgZone } from "@angular/core";
import { BehaviorSubject, timer, of, throwError } from "rxjs";
import { HttpClient } from "@angular/common/http";
import {
  retryWhen,
  tap,
  delayWhen,
  finalize,
  map,
  delay,
  concatMap
} from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class LoginserviceService {
  IsLogged: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  TentativasLogin: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  TentativaLogin: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  constructor(private Http: HttpClient, private Zone: NgZone) {}

  Logoff() {
    this.IsLogged.next(false);
  }

  DoLogin(Login, Senha) {
    this.TentativaLogin.next(true);
    this.IsLogged.next(false);
    this.TentativasLogin.next(0);
    return this.Http.get(`http://localhost:3000/login/${Login}`).pipe(
      retryWhen(errors =>
        errors.pipe(
          // log error message
          tap(Val => {
            this.Zone.run(() => {
              this.TentativasLogin.next(this.TentativasLogin.value + 1);
            });
            console.log(
              `Ocorreu um erro ao realizar o login da aplicação. Tentaviva numero ${this.TentativasLogin.value} `
            );
          }),
          concatMap((Val) => {
            console.log(Val);
            if (Val && Val.status === 404) {
              return throwError("Usuario ou senha inválido (Usuario não encontrado)");
            }
            return of(null).pipe(delay(1000));
          }),
        )
      ),
      map((RS: any) => {
        // Verificando o atributo name do resultset
        if (!RS || !RS.name)
          throw new Error("Usuario ou senha inválido (Usuario não encontrado)");
        if (RS.senha !== Senha)
          throw new Error("Usuario ou senha inválido (Senha inválida)");
        this.IsLogged.next(true);
        return RS;
      }),
      finalize(() => {
        this.TentativaLogin.next(false);
        this.TentativasLogin.next(0);
      })
    );
  }
}
