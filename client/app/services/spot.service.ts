import { Injectable }    from '@angular/core';
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
  private spots: Spots;
  private countries: Countries;

  constructor(private apiService: APIService) { }

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

  public get(id: number): Spot {
    return this.spots[id];
  }

  public getConditions(id: number): Promise<any> {
    return this.apiService.getSpotConditions(id);
  }
}

