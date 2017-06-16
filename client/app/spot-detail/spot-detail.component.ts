import 'rxjs/add/operator/switchMap';
import { Component, OnInit }      from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location }               from '@angular/common';

import { Spot }        from './../spots/spot';
import { SpotService } from './../services/spot.service';

@Component({
  selector: 'spot-detail',
  templateUrl: './spot-detail.component.html',
  styleUrls: [ './spot-detail.component.css' ]
})
export class SpotDetailComponent implements OnInit {
  spot: Spot;

  constructor(
    private spotService: SpotService,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.route.params
      .switchMap((params: Params) => this.spotService.getSpot(+params['id']))
      .subscribe(spot => this.spot = spot);
  }

  save(): void {
    this.spotService.update(this.spot)
      .then(() => this.goBack());
  }

  goBack(): void {
    this.location.back();
  }
}
