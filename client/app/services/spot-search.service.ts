import { Injectable } from '@angular/core';
import { Http }       from '@angular/http';

import { Observable }     from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { Spot }           from './../spots/spot';

@Injectable()
export class SpotSearchService {

  constructor(private http: Http) {}

  search(term: string): Observable<Spot[]> {
    return this.http
               .get(`app/spotes/?name=${term}`)
               .map(response => response.json().data as Spot[]);
  }
}
