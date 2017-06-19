import { Injectable } from '@angular/core';
import { APIService } from "./api.service";
import {Spot} from "./spot.service";

export type User = {
    _id: number;
    name: string;
    preferenses: {
        favouriteSpots: number []
    }
}

@Injectable()
export class UserService {
    private user: User;

    constructor(private apiService: APIService) {}

    public initUser(): Promise<boolean> {
        return this.apiService.getUser()
            .then(user => {
                this.user = user;
                return true;
            });
    }

    public getUser(): User {
        return this.user;
    }

    public addToFavourite(spot: Spot): void {
        this.apiService.addFavouriteSpot(spot);
    }

    public removeFavourite(id: number): Promise<boolean> {
        return this.apiService.removeFavouriteSpot(id);
    }
}