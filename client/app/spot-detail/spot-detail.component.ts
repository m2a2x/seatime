import 'rxjs/add/operator/switchMap';
import { Component, OnInit }      from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location }               from '@angular/common';
import * as moment from 'moment';

import {Spot, SpotService} from '../services/spot.service';

@Component({
  selector: 'spot-detail',
  templateUrl: './spot-detail.component.html',
  styleUrls: [ './spot-detail.component.css' ]
})
export class SpotDetailComponent implements OnInit {
  public spot: Spot;
  public swellData: any[];

  constructor(
    private spotService: SpotService,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
        this.spot = this.spotService.getSpot(+params['id']);
        this.spotService.getSpotForecast(+params['id']).then(response => {
          this.swellData = _.map(response, (item: any) => {
            item.localTimestamp = moment(item.localTimestamp * 1000).format('DD MMM');
            return item;
          });
        });
      }
    );
  }

  goBack(): void {
    this.location.back();
  }
}
