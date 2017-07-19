import { Injectable } from '@angular/core';
import {APIService, DataQuery, Reload} from "./api.service";
import {UserService} from "./user.service";

export type Country = {
    _id: number;
    name: string;
};

export type Tide = {
    shift: number,
    state: string,
    timestamp: string
};

export type Spot = {
    _id: number;
    _country: number;
    name: string;
    meta?: {
        lat: number,
        lon: number
    },
    tide?: {

    },
    favourite?: boolean
}

@Injectable()
export class DataService {
    constructor(private apiService: APIService, private userService: UserService) {}

    public reload(fields?: DataQuery): Promise<Reload> {
        return this.apiService.reload(fields).then((response: Reload) => {
            this.userService.set(response.user);
            delete response.user;
            return response;
        });
    }
}