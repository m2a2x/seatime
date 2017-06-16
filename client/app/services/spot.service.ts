import { Injectable }    from '@angular/core';
import { Http, Headers, Response } from '@angular/http'; // {Headers}

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';

import { Spot } from './../spots/spot';

@Injectable()
export class SpotService {

  private headers = new Headers({'Content-Type': 'application/json'});
  private spotesUrl = 'api/spots';  // URL to web api

  constructor(private http: Http) { }

  getSpots(): Promise<Spot[]> {
    return this.http.get(this.spotesUrl)
               .toPromise()
               .then(response => response.json().data as Spot[])
               .catch(this.handleError);
  }

  getSpot(id: number): Promise<Spot> {
    const url = `${this.spotesUrl}/${id}`;
    return this.http.get(url)
      .toPromise()
      .then(response => response.json().data as Spot)
      .catch(this.handleError);
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
    const url = `${this.spotesUrl}/${spot.id}`;
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

