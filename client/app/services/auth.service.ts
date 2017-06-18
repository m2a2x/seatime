import { Injectable } from '@angular/core';
import {UserService} from "./user.service";

@Injectable()
export class AuthenticationService {
    constructor(private userService: UserService) {}

    public isLoggedIn(): boolean {
        if (this.userService.getUser()) {
            return true;
        }
        return false;
    }
}