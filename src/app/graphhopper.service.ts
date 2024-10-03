import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GraphhopperService {

  private baseUrl = 'https://graphhopper.com/api/1/route';

  constructor(private http: HttpClient) { }

  getRoute(start: [number, number], end: [number, number]): Observable<any> {
    const url = `${this.baseUrl}?point=${start[1]},${start[0]}&point=${end[1]},${end[0]}&vehicle=car&key=${environment.graphhopperApiKey}`;
    return this.http.get(url);
  }
}
