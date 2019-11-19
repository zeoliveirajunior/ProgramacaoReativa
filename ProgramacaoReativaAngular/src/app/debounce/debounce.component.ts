import { MoviesService } from "./../movies.service";
import {
  Component,
  OnInit,
  OnChanges,
  SimpleChanges,
  NgZone
} from "@angular/core";

@Component({
  selector: "app-debounce",
  templateUrl: "./debounce.component.html",
  styleUrls: ["./debounce.component.scss"]
})
export class DebounceComponent implements OnInit {

  Pesquisando = false;

  Filmes;

  RequisicoesSemDebounce = 0;

  constructor(private Movie: MoviesService, private Zone: NgZone) {}

  OnChangeSemDebounce(Valor) {
    if (Valor) {
      this.Pesquisando = true;
      this.Movie.getMovies(Valor).subscribe(RS =>
        this.Zone.run(() => {
          this.RequisicoesSemDebounce++;
          this.Pesquisando = false;
          this.Filmes = RS;
        })
      , Erro => this.Zone.run(() => this.Pesquisando = false));
    } else {
      this.Zone.run(() => {
        this.Filmes = null;
      });
    }
  }

  ngOnInit() {}
}
