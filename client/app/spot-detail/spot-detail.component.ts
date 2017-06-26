import 'rxjs/add/operator/switchMap';
import { Component, OnInit }      from '@angular/core';
import { ActivatedRoute }         from '@angular/router';
import { Location }               from '@angular/common';
import * as _                     from 'lodash';
import * as moment                from 'moment';

import {Spot, SpotService} from '../services/spot.service';

type Tide = {
  shift: number;
  state: string;
  date: string;
};

@Component({
  selector: 'spot-detail',
  templateUrl: './spot-detail.component.html',
  styleUrls: [ './spot-detail.component.css' ]
})

export class SpotDetailComponent implements OnInit {
  public spot: Spot;
  public swellData: any[];
  public tideData: Tide[];
  public spotId: number;

  constructor(
    private spotService: SpotService,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
        this.spot = this.spotService.get(+params['id']);
        this.spotId = +params['id'];


        this.spotService.getConditions(this.spotId).then(response => {
          // moment(item.localTimestamp * 1000).format('DD MMM');
          this.swellData = response.forecast;
          this.tideData = _.map(response.conditions.tide, (tide: {shift: number, state: string, timestamp: number}): Tide => {
            return {
              shift: tide.shift,
              state: tide.state,
              date: moment(tide.timestamp * 1000).format('DD MMM, hh:mm')
            };
          });
        });
      }
    );
  }

  goBack(): void {
    this.location.back();
  }
}
