import { Injectable }    from '@angular/core';
import { Http, Headers } from '@angular/http';
import * as _ from "lodash";

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';

import {APIService} from "./api.service";

export type Country = {
  _id: number;
  name: string;
};

export type Countries = _.Dictionary<Country>;

export type Spot = {
  _id: number;
  _country: number;
  name: string;
}

export type Spots = _.Dictionary<Spot>;

@Injectable()
export class SpotService {

  private headers = new Headers({'Content-Type': 'application/json'});
  private spotesUrl = 'api/spots';
  private spots: Spots;
  private countries: Countries;

  constructor(private http: Http, private apiService: APIService) { }

  public set(spots: Spots, countries: Countries): void {
    this.spots = spots;
    this.countries = countries;
  }

  public getSpots(): Spots {
    return this.spots;
  }

  public getCountries(): Countries {
    return this.countries;
  }

  public getSpot(id: number): Spot {
    return this.spots[id];
  }

  public getSpotData(id: number): Promise<Spot> {
    return this.apiService.getSpot(id).then(response => response[0]);
  }

  public getSpotForecast(id: number): Promise<any> {
    return this.apiService.getSpotForecast(id);
  }

  public update(spot: Spot): Promise<Spot> {
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

