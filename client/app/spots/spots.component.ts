import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Country, Spot, Spots, SpotService}         from '../services/spot.service';
import {UserService} from "../services/user.service";
import {Router} from "@angular/router";
import * as _ from "lodash";
import {MapProvider} from "../services/map.provider";


@Component({
  selector: 'places-section',
  templateUrl: './spots.component.html',
  styleUrls: [ './spots.component.css' ]
})
export class SpotsComponent implements OnInit {
  @ViewChild('bgmap') map: ElementRef;

  private spots: Spot[];
  private countries: Country[];

  constructor(
    private spotService: SpotService,
    private userService: UserService,
    private mapProvider: MapProvider,
    private router: Router) { }


  public ngOnInit(): void {
    this.countries = _.sortBy<Country>(this.spotService.getCountries(), 'name');
    this.mapProvider.set(this.map.nativeElement);
  }

  public sortByCountry(id: number) {
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
