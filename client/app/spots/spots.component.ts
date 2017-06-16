import { Component, OnInit } from '@angular/core';
import { Router }            from '@angular/router';

import { Spot }                from './spot';
import { SpotService }         from './../services/spot.service';

@Component({
  selector: 'my-spotes',
  templateUrl: './spots.component.html',
  styleUrls: [ './spots.component.css' ]
})
export class SpotesComponent implements OnInit {
  spotes: Spot[];
  selectedSpot: Spot;

  constructor(
    private spotService: SpotService,
    private router: Router) { }

  getSpots(): void {
    this.spotService
        .getSpots()
        .then(spotes => this.spotes = spotes);
  }

  add(name: string): void {
    name = name.trim();
    if (!name) { return; }
    this.spotService.create(name)
      .then(spot => {
        this.spotes.push(spot);
        this.selectedSpot = null;
      });
  }

  delete(spot: Spot): void {
    this.spotService
        .delete(spot.id)
        .then(() => {
          this.spotes = this.spotes.filter(h => h !== spot);
          if (this.selectedSpot === spot) { this.selectedSpot = null; }
        });
  }

  ngOnInit(): void {
    this.getSpots();
  }

  onSelect(spot: Spot): void {
    this.selectedSpot = spot;
  }

  gotoDetail(): void {
    this.router.navigate(['/detail', this.selectedSpot.id]);
  }
}
