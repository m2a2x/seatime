import { Injectable } from '@angular/core';
import {APIService, DataQuery, Reload} from "./api.service";
import {UserService} from "./user.service";

export type Country = {
    _id: number;
    name: string;
};

export type Swell = {
    components: {
        combined: {
            isOffshore: boolean,
            compassDirection: string,
            power: number
        },
        primary: {},
        secondary: {}
    },
    maxBreakingHeight: number,
    minBreakingHeight: number,
    period: number,
    unit: string
};

export type Tide = {
    shift: number,
    state: string,
    timestamp: number
};

export type Spot = {
    _id: number;
    _country: number;
    name: string;
    meta?: {
        lat: number,
        lon: number
    },
    tide?: Tide[],
    swell?: {},
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