import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions, Response, URLSearchParams } from '@angular/http';
import * as _ from 'lodash';
import {Reload} from "../models/reload";
import {UserService} from "./user.service";

export type DataQuery = {
    [key: string]: string;
}

export type Pair = {
    pair: number,
    time: number
};

@Injectable()
export class APIService {
    private headers: Headers = new Headers({'Content-Type': 'application/json'});

    constructor(private http: Http, private userService: UserService) {}


    public addFavouriteSpot(id: number): Promise<boolean> {
        const url: string = 'api/user/spots';
        return this.http
            .post(`${url}/${id}`, null, {headers: this.headers})
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    public removeFavouriteSpot(id: number): Promise<boolean> {
        const url: string = 'api/user/spots';
        return this.http
            .delete(`${url}/${id}`, {headers: this.headers})
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    public getSpotConditions(ids: number[], time?: number): Promise<any> {
        const url: string = 'api/spots/getConditions';

        let requestOptions = new RequestOptions();
        let params: URLSearchParams = new URLSearchParams();
        params.set('spots', ids.join(','));
        if (time) {
            params.set('end', time.toString());
        }
        requestOptions.params = params;

        return this.http.get(
            url, {
                search: params
            })
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    public reload(fields?: DataQuery): Promise<Reload> {
        const url: string = 'api/reload';

        let requestOptions = new RequestOptions();
        let params: URLSearchParams = new URLSearchParams();


        _.each(fields, (k: string, i: string) => {
            params.set(i, k);
        });
        requestOptions.params = params;


        return this.http.get(
            url, {
                search: params
            })
            .toPromise()
            .then((response: Response) => {
                return new Reload(response.json(), this.userService);
            })
            .catch(this.handleError);
    }


    public setSync(pair: number): Promise<boolean> {
        const url: string = 'api/sync';

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
                return response.json().isSuccesful as boolean;
            })
            .catch(this.handleError);

    }


    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }
}