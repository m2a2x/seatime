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

@Injectable()

export class APIService {
    private headers: Headers = new Headers({'Content-Type': 'application/json'});

    constructor(private http: Http) {}


    public addFavouriteSpot(spot: Spot): Promise<boolean> {
        console.log(this.headers);
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
        console.log(this.headers);
        return this.http
            .delete(`${'api/user/spots'}/${id}`, {headers: this.headers})
            .toPromise()
            .then((data) => {
                console.log(data);
                return true;
            })
            .catch(this.handleError);
    }

    public getSpot(id: number): Promise<any> {
        let url = `${'api/spots'}/${id}`;
        return this.http.get(url)
            .toPromise()
            .then(response => response.json().data)
            .catch(this.handleError);
    }

    public getSpotForecast(id: number): Promise<any> {
        let url = `${'api/spot/forecast'}/${id}`;
        return this.http.get(url)
            .toPromise()
            .then(response => response.json().data)
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


    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }
}