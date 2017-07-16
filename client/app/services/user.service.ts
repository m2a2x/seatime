import { Injectable } from '@angular/core';
import { APIService } from "./api.service";
import {Spot} from "./data.service";


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

    public set(user: User | null): void {
        this.user = user;
    }

    public getUser(): User {
        return this.user;
    }

    public removeFavourite(id: number): Promise<boolean> {
        return this.apiService.removeFavouriteSpot(id);
    }
}