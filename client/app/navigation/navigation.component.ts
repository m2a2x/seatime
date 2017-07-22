import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from "../services/auth.service";
import {NavigationEnd, Router} from "@angular/router";
import {DataService} from "../services/data.service";
import {Subscription} from "rxjs";
import {Spot} from "../models/spot";

@Component({
    selector: 'navigation',
    templateUrl: './navigation.component.html',
    styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {
    private _subscriptions: Subscription[] = [];
    public additionItem: Spot | undefined;
    constructor(
        private authService: AuthenticationService,
        private router: Router,
        private dataService: DataService) {}

    public isLoggedIn(): boolean {
        return this.authService.isLoggedIn();
    }


    public ngOnInit(): void {
        this.router.events
            .filter((event) => event instanceof NavigationEnd)
            .subscribe((event: NavigationEnd) => {
                let path: string[] = event.url.split('/');

                for (const sub of this._subscriptions) {
                    sub.unsubscribe();
                }

                if (path[1] === 'spots') {
                    this._subscriptions.push(this.dataService
                        .spotUpdated.subscribe((value: Spot) => this.additionItem = value)
                    );
                } else {
                    this.additionItem = undefined;
                }
            });
    }

}
