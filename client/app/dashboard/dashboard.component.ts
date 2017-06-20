import { Component, OnInit } from '@angular/core';
import * as _ from "lodash";

import {Spot, Spots, SpotService} from '../services/spot.service';
import { Router }            from '@angular/router';
import {UserService, User} from "../services/user.service";

@Component({
  selector: 'my-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [ './dashboard.component.css' ]
})

export class DashboardComponent implements OnInit {
  private spots: Spot[];
  private selectedSpot: Spot;

  constructor(private spotService: SpotService,
              private userService: UserService,
              private router: Router) { }

  public ngOnInit(): void {
    let spots: Spots = this.spotService.getSpots();
    let user: User = this.userService.getUser();
    this.spots = _.filter<Spot>(spots, (spot: Spot): boolean => {
      return _.includes<number>(user.preferenses.favouriteSpots, spot._id);
    });
  }


  public delete(spot: Spot): void {
    this.userService
        .removeFavourite(spot._id)
        .then(() => {
          this.spots = this.spots.filter(h => h !== spot);
          if (this.selectedSpot === spot) { this.selectedSpot = null; }
        });
  }

  public onSelect(spot: Spot): void {
    this.selectedSpot = spot;
  }

  public gotoDetail(): void {
    this.router.navigate(['/detail', this.selectedSpot._id]);
  }
}
