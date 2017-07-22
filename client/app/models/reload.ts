import {Country, Spot} from "./spot";
import {User, UserService} from "../services/user.service";
import {SerializationHelper} from "../services/serialization.helper";
import * as _ from 'lodash';

export interface ReloadI {
    spots?: Spot[],
    countries?: Country[],
    user?: User,
    spot_count: number
}

export class Reload implements ReloadI {
    spots: Spot[];
    countries: Country[];
    user: User;
    spot_count: number;

    constructor(private jsonObj: ReloadI, private userService: UserService) {
        if (jsonObj.user) {
            this.userService.set(jsonObj.user);
            delete jsonObj.user;
        }
        _.merge(this, jsonObj);
        this.spots = _.map(jsonObj.spots, (spot: Spot) => SerializationHelper.toInstance(new Spot(), spot));
    }
};
