import { Injectable } from '@angular/core';
import * as _ from 'lodash';


export type User = {
    _id: number;
    name: string;
    preferenses: {
        favouriteSpots: number [],
        devices: {_id: string, name: string}[]
    }
}

@Injectable()
export class UserService {
    private user: User;

    constructor() {}

    public set(user: User | null): void {
        this.user = user;
    }

    public getUser(): User {
        return this.user;
    }

    public isFavourite(id: number): boolean {
        if (!this.user) {
            return false;
        }
        return _.includes(this.user.preferenses.favouriteSpots, id);
    }
}