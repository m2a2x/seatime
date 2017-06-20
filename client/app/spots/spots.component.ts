import { Component, OnInit } from '@angular/core';
import {Country, Spot, Spots, SpotService}         from '../services/spot.service';
import {UserService} from "../services/user.service";
import {Router} from "@angular/router";
import * as _ from "lodash";

@Component({
  selector: 'my-spotes',
  templateUrl: './spots.component.html',
  styleUrls: [ './spots.component.css' ]
})
export class SpotsComponent implements OnInit {
  private spots: Spot[];
  private countries: Country[];

  constructor(
    private spotService: SpotService,
    private userService: UserService,
    private router: Router) { }


  public ngOnInit(): void {
    this.countries = _.toArray<Country>(this.spotService.getCountries());
  }

  private sortByCountry(id: number) {
    this.spots = _.filter<Spot>(this.spotService.getSpots(), {
      _country: id
    });
  }

  public addSpot(spot: Spot, e: Event): void {
    e.stopPropagation();
    this.userService.addToFavourite(spot);
  }

  public gotoDetail(id: number): void {
    this.router.navigate(['/detail', id]);
  }
}
