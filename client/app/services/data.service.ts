import { Injectable } from '@angular/core';
import {APIService, Reload} from "./api.service";
import {UserService} from "./user.service";

export type Country = {
    _id: number;
    name: string;
};

export type Spot = {
    _id: number;
    _country: number;
    name: string;
}

@Injectable()
export class DataService {
    constructor(private apiService: APIService, private userService: UserService) {}

    public reload(params: string): Promise<Reload> {
        return this.apiService.reload(params).then((response: Reload) => {
            this.userService.set(response.user);
            delete response.user;
            return response;
        });
    }
}