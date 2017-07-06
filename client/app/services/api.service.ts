import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import {User} from "./user.service";
import {Spot, Spots, Countries} from "./spot.service";

export type Reload = {
    spots: Spots,
    countries: Countries,
    user: User,
    token: string
};

export type Pair = {
    pair: number,
    time: number
};

@Injectable()

export class APIService {
    private headers: Headers = new Headers({'Content-Type': 'application/json'});

    constructor(private http: Http) {}


    public addFavouriteSpot(spot: Spot): Promise<boolean> {
        return this.http
            .post(`${'api/user/spots'}/${spot._id}`, null, {headers: this.headers})
            .toPromise()
            .then((data) => {
                console.log(data);
                return true;
            })
            .catch(this.handleError);
    }

    public removeFavouriteSpot(id: number): Promise<boolean> {
        return this.http
            .delete(`${'api/user/spots'}/${id}`, {headers: this.headers})
            .toPromise()
            .then((data) => {
                console.log(data);
                return true;
            })
            .catch(this.handleError);
    }

    public getSpotConditions(id: number): Promise<any> {
        let url = `${'api/spots/getConditions'}/${id}`;
        return this.http.get(url)
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    public reload(): Promise<Reload> {
        let url = `${'api/reload'}`;
        return this.http.get(url)
            .toPromise()
            .then((response) => {
                let data: Reload = response.json().data as Reload;
                this.headers.append('x-csrf-token', data.token);
                return data;
            })
            .catch(this.handleError);
    }


    public setSync(pair: number): Promise<boolean> {
        let url = `${'api/sync'}`;

        return this.http.post(
            url,
            {
                pair: pair
            },
            {
                headers: this.headers
            }
        )
            .toPromise()
            .then((response) => {
                return response.json().IsSuccesful as boolean;
            })
            .catch(this.handleError);

    }


    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }
}