import { Injectable }    from '@angular/core';
import { Http, Headers } from '@angular/http';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';

import {APIService} from "./api.service";

export type Spot = {
  _id: number;
  name: string;
}


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

