import {
  AfterViewInit,
  Component,
  ElementRef,
  NgZone,
  OnInit,
  ViewChild
} from "@angular/core";
import { fromEvent, interval, throwError } from "rxjs";
import { catchError, debounce, map, switchMap, tap } from "rxjs/operators";
import { MoviesService } from "./../movies.service";

@Component({
  selector: "app-debounce",
  templateUrl: "./debounce.component.html",
  styleUrls: ["./debounce.component.scss"]
})
export class DebounceComponent implements OnInit, AfterViewInit {
  Pesquisando = false;

  Filmes;
  TempoDebounce = 400;
  TimeoutDebounce;

  RequisicoesSemDebounce = 0;
  RequisicoesReativa = 0;
  RequisicoesDebounce = 0;

  @ViewChild("InputDebounce", { static: false })
  InputDebounce: ElementRef;

  constructor(private Movie: MoviesService, private Zone: NgZone) {}

  /**
   * Implementação simples sem debounce
   * @param Valor
   */
  OnChangeSemDebounce(Valor) {
    if (!Valor) {
      this.Filmes = null;
      return;
    }
    this.RecuperarFilmes(Valor).subscribe(() => {
      this.Zone.run(() => {
        this.RequisicoesSemDebounce++;
      });
    });
  }

  /**
   * Implementação do debounce sem observable
   * - Passos : Criamos um timeout, e a cada novo input, limpamos o timeout e criamos outro novamente
   * @param Valor
   */
  OnChangeDebounce(Valor) {
    if (this.TimeoutDebounce) {
      clearTimeout(this.TimeoutDebounce);
    }
    if (!Valor) {
      this.Filmes = null;
      return;
    }
    this.TimeoutDebounce = setTimeout(() => {
      this.RecuperarFilmes(Valor).subscribe(() => {
        this.Zone.run(() => {
          this.RequisicoesDebounce++;
        });
      });
    }, this.TempoDebounce);
  }

  ngOnInit() {}

  ngAfterViewInit(): void {
    if (this.InputDebounce) {
      /**
       * Implementação utilizando programação reativa
       */
      fromEvent(this.InputDebounce.nativeElement, "input").subscribe((Evento: any) => console.log(Evento.target.value));

    }
  }

  RecuperarFilmes(ValorPesquisa) {
    this.Pesquisando = true;
    return this.Movie.getMovies(ValorPesquisa).pipe(
      tap(
        RS => {
          this.Zone.run(() => {
            this.Pesquisando = false;
            this.Filmes = RS;
          });
        },
        catchError(Erro => {
          this.Zone.run(() => {
            this.Pesquisando = false;
          });
          return throwError(Erro);
        })
      )
    );
  }
}
