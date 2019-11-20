import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class MoviesService {
  ApiKey = "c252b8fd";
  Url = "http://www.omdbapi.com/?s=";

  constructor(private http: HttpClient) {}

  getMovies(Pesquisa): Observable<string> {
    return this.http.get(`${this.Url}${Pesquisa}&apikey=${this.ApiKey}`).pipe(
      map((RS: any) => {
        if (RS && RS.Search && RS.Search.length > 0)
          return RS.Search.map(El => El.Title);
        return null;
      })
    );
  }
}
