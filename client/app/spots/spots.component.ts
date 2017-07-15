import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Country, Spot} from "../services/data.service";
import {UserService} from "../services/user.service";
import {Router} from "@angular/router";
import {MapProvider} from "../services/map.provider";
import {DataService} from "../services/data.service";

type Reload = {
    spots: Spot[];
    countries: Country[];
};

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
    private dataService: DataService,
    private userService: UserService,
    private mapProvider: MapProvider,
    private router: Router) { }


  public ngOnInit(): void {
    this.dataService.reload('countries, spots').then((response: Reload) => {
        let data: Reload = response as Reload;
      // this.countries = _.sortBy<Country>(this.spotService.getCountries(), 'name');
        this.spots = data.spots;
    });
    this.mapProvider.set(this.map.nativeElement);
    this.showDrop();
  }

  public sortByCountry(id: number) {
    /* this.spots = _.filter<Spot>(this.spotService.getSpots(), {
      _country: id
    }); */
  }



  public addSpot(spot: Spot, e: Event): void {
    e.stopPropagation();
    this.userService.addToFavourite(spot);
  }

  public gotoDetail(id: number): void {
    this.router.navigate(['/detail', id]);
  }

  public showDrop():void {

  }
}
