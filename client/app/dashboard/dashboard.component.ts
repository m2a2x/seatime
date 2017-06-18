import { Component, OnInit } from '@angular/core';

import { Spot }        from '../models/spot';
import { SpotService } from '../services/spot.service';
import { Router }            from '@angular/router';

@Component({
  selector: 'my-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [ './dashboard.component.css' ]
})
export class DashboardComponent implements OnInit {
  private spots: Spot[] = [];
  private selectedSpot: Spot;

  constructor(private spotService: SpotService,
              private router: Router) { }

  ngOnInit(): void {
    this.spots = this.spotService.getSpots();
  }

  add(name: string): void {
    name = name.trim();
    if (!name) { return; }
    this.spotService.create(name)
        .then(spot => {
          this.spots.push(spot);
          this.selectedSpot = null;
        });
  }

  delete(spot: Spot): void {
    this.spotService
        .delete(spot._id)
        .then(() => {
          this.spots = this.spots.filter(h => h !== spot);
          if (this.selectedSpot === spot) { this.selectedSpot = null; }
        });
  }

  onSelect(spot: Spot): void {
    this.selectedSpot = spot;
  }

  gotoDetail(): void {
    this.router.navigate(['/detail', this.selectedSpot._id]);
  }
}
