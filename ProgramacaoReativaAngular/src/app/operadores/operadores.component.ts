import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  ElementRef,
  NgZone
} from "@angular/core";
import { fromEvent, interval, Subject, merge, Observable } from "rxjs";
import {
  map,
  filter,
  takeUntil,
  debounce,
  distinct,
  tap,
  distinctUntilChanged,
  mergeMap,
  concatMap,
  take,
  switchMap
} from "rxjs/operators";

@Component({
  selector: "app-operadores",
  templateUrl: "./operadores.component.html",
  styleUrls: ["./operadores.component.scss"]
})
export class OperadoresComponent implements OnInit, AfterViewInit {
  @ViewChild("exampleMap", { static: true })
  exampleMap: ElementRef;

  @ViewChild("exampleAtores", { static: true })
  exampleAtores: ElementRef;

  @ViewChild("exampleCampo2", { static: true })
  exampleCampo2: ElementRef;

  @ViewChild("exampleCampo1", { static: true })
  exampleCampo1: ElementRef;

  @ViewChild("btnSwithMap", { static: true })
  btnSwithMap: ElementRef;

  OperadorMap;
  OperadorFilter;
  CancelFilter: Subject<any> = new Subject<any>();
  OperadorDebounce;
  OperadorMerge;
  OperadorConcatMap;

  Requests = 0;
  UltimoValorPesquisado;
  ContadorSwitchMap;

  constructor(private Zone: NgZone) {}

  ngOnInit() {
    // Criando os stream com o textfields
    this.CriarStreamExemploMap();
    this.CriarStreamExemploDebounce();
    this.CriarExemploMerge();
    this.CriarExemploSwitchMap();
  }

  ngAfterViewInit(): void {}

  /**
   * Exemplo utilizando o operador Map
   */
  CriarStreamExemploMap() {
    // Criamos um Stream atraves do evento 'input' do textfield
    // Um novo valor será emitido a cada nova alteração do campo de texto
    this.OperadorMap = fromEvent(this.exampleMap.nativeElement, "input").pipe(
      map((Evento: any) => {
        console.log(Evento);
        // recuperamos o valor digitado no campo
        // tslint:disable-next-line: variable-name
        const _Valor = Evento.target.value;
        // Se o campo está vazio, então retornamos
        if (!_Valor) return "";
        try {
          // convertemos o valor digitado para um valor float
          const _ValorNumerico = parseFloat(_Valor);
          // Caso o valor não seja valido, enviamos o evento para um catch para retornar a mensagem tratada
          if (!_ValorNumerico || isNaN(_ValorNumerico))
            throw new Error("Valor inválido");
          // Enviando o quadrado do numero
          return _ValorNumerico * _ValorNumerico;
        } catch (E) {
          return "Valor inválido. Por favor, digite um numero";
        }
      })
    );
  }

  CriarStreamExemploDebounce() {
    this.OperadorDebounce = this.CriarStreamInput(this.exampleAtores).pipe(
      debounce(() => interval(1000)),
      distinctUntilChanged(),
      tap(Valor => {
        console.log(Valor);
        this.Zone.run(() => {
          this.Requests++;
        });
      })
    );
  }

  CriarExemploMerge() {
    // tslint:disable-next-line: variable-name
    const _ObservableCampo2 = this.CriarStreamInput(this.exampleCampo2);
    this.OperadorMerge = this.CriarStreamInput(this.exampleCampo1).pipe(
      mergeMap(Campo1 => {
        return _ObservableCampo2.pipe(map(Campo2 => Campo1 + " " + Campo2));
      })
    );
  }

  private CriarStreamInput(Input: ElementRef): Observable<string> {
    return fromEvent(Input.nativeElement, "input").pipe(
      map((Evento: any) => Evento.target.value)
    );
  }

  /**
   * SwitchMap
   */
  CriarExemploSwitchMap() {
    // Criamos um observable do evento click do botão
    fromEvent(this.btnSwithMap.nativeElement, "click")
      .pipe(
        switchMap(() => {
          // switchmap cancela o ultimo interval e cria um novo, reiniciando do 0
          return interval(1000);
        })
      )
      .subscribe((Valor) => {
        this.Zone.run(() => {
          this.ContadorSwitchMap = Valor;
        });
      });
  }

  /**
   * Exemplo filter e take until
   */
  IniciarExemploFilter() {
    this.OperadorFilter = interval(1000).pipe(
      filter((val: number) => val % 2 === 0),
      takeUntil(this.CancelFilter)
    );
  }

  PararExemploFilter() {
    this.CancelFilter.next(true);
    this.OperadorFilter = null;
  }

  /**
   * concatMap
   * Cada nova emissão do observable superior ativa o observable inferior
   */
  IniciarExemploConcat() {
    this.OperadorConcatMap = interval(1000).pipe(
      concatMap(ValorRecebido => {
        console.log(ValorRecebido);
        // tslint:disable-next-line:max-line-length
        return interval(1000).pipe(
          map(Valor =>
            ValorRecebido
              ? `Multiplicador: ${ValorRecebido}: ${Valor * ValorRecebido}`
              : Valor
          ),
          take(5)
        );
      }),
      takeUntil(this.CancelFilter)
    );
  }

  PararExemploConcat() {
    this.CancelFilter.next(true);
    this.OperadorConcatMap = null;
  }
}
