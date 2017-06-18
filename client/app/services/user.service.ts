import { Injectable } from '@angular/core';

import { User } from '../models/user';
import {Spot} from "../models/spot";
import {APIService} from "./api.service";

@Injectable()
export class UserService {
    private user: User;

    constructor(private apiService: APIService) {}

    public initUser(): Promise<boolean> {
        return this.apiService.getUser()
            .then(response => {
                this.user = response;
                return true;
            });
    }

    public getUser(): User {
        return this.user;
    }

    public addToFavourite(spot: Spot): void {
        this.apiService.addFavouriteSpot(spot);
    }
}