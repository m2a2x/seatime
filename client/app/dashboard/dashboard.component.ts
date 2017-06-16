import { Component, OnInit } from '@angular/core';

import { Spot }        from './../spots/spot';
import { SpotService } from './../services/spot.service';

@Component({
  selector: 'my-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [ './dashboard.component.css' ]
})
export class DashboardComponent implements OnInit {
  spots: Spot[] = [];

  constructor(private spotService: SpotService) { }

  ngOnInit(): void {
    this.spotService.getSpots()
      .then(spots => this.spots = spots);
  }
}
