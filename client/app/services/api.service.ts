import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import {User} from "./user.service";
import {Spot} from "./spot.service";


export type UserData = {
    user: User,
    token: string
};

@Injectable()

export class APIService {
    private headers: Headers = new Headers({'Content-Type': 'application/json'});

    constructor(private http: Http) {}


    public getUser(): Promise<User> {
        return this.http.get(`${'api/user'}`)
                .toPromise()
                .then((response) => {
                    let userData: UserData = response.json() as UserData;
                    this.headers.append('x-csrf-token', userData.token);
                    return userData.user;
                })

                .catch(this.handleError);
    }

    public addFavouriteSpot(spot: Spot): Promise<boolean> {
        console.log(this.headers);
        return this.http
            .post(`${'api/user/spots'}/${spot._id}`, null, {headers: this.headers})
            .toPromise()
            .then((data) => {
                console.log(data);
                return true;
            })
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
    }

    public getSpot(id?: number): Promise<Spot[]> {
        let url = `${'api/spots'}`;
        if (id) {
            url += `/${id}`;
        }
        return this.http.get(url)
            .toPromise()
            .then(response => response.json().data as Spot[])
            .catch(this.handleError);
    }


    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }
}