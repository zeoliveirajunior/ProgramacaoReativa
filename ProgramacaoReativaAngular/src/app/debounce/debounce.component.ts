import { MoviesService } from "./../movies.service";
import {
  Component,
  OnInit,
  OnChanges,
  SimpleChanges,
  NgZone,
  AfterViewInit,
  ViewChild,
  ElementRef
} from "@angular/core";
import { of, throwError, fromEvent, interval } from "rxjs";
import {
  tap,
  catchError,
  map,
  debounce,
  concatMap,
  switchMap
} from "rxjs/operators";

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
      fromEvent(this.InputDebounce.nativeElement, "input")
        .pipe(
          /* Map para transformar o evento, pegar o target e enviar o valor  */
          map((Evento: any) => {
            if (!Evento.target.value) {
              this.Zone.run(() => (this.Filmes = null));
            }
            return Evento.target.value;
          }),
          /* cria um debounce a cada 1 segundo */
          debounce(() => interval(this.TempoDebounce)),
          /* switch map cancela o ultimo observable em execução */
          switchMap(Valor => this.RecuperarFilmes(Valor))
        )
        .subscribe(Valor =>
          this.Zone.run(() => {
            this.RequisicoesReativa++;
          })
        );
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
