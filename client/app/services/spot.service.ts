import { Injectable }    from '@angular/core';
import { Http, Headers, Response } from '@angular/http'; // {Headers}

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';

import { Spot } from '../models/spot';
import {APIService} from "./api.service";

@Injectable()
export class SpotService {

  private headers = new Headers({'Content-Type': 'application/json'});
  private spotesUrl = 'api/spots';
  private spots: Spot[] = [];

  constructor(private http: Http, private apiService: APIService) { }

  initSpots(): Promise<Spot[]> {
    return this.apiService.getSpot().then(response => this.spots = response);
  }

  getSpots(): Spot[] {
    return this.spots;
  }

  getSpot(id: number): Promise<Spot> {
    return this.apiService.getSpot(id).then(response => response[0]);
  }

  delete(id: number): Promise<void> {
    const url = `${this.spotesUrl}/${id}`;
    return this.http.delete(url, {headers: this.headers})
      .toPromise()
      .then(() => null)
      .catch(this.handleError);
  }

  create(name: string): Promise<Spot> {
    return this.http
      .post(this.spotesUrl, JSON.stringify({name: name}), {headers: this.headers})
      .toPromise()
      .then(res => res.json().data as Spot)
      .catch(this.handleError);
  }

  update(spot: Spot): Promise<Spot> {
    const url = `${this.spotesUrl}/${spot._id}`;
    return this.http
      .put(url, JSON.stringify(spot), {headers: this.headers})
      .toPromise()
      .then(() => spot)
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}

