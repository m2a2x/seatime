import 'rxjs/add/operator/switchMap';
import { Component, OnInit }      from '@angular/core';
import { ActivatedRoute }         from '@angular/router';
import { Location }               from '@angular/common';
import * as _                     from 'lodash';
import * as moment                from 'moment';

import {Spot, SpotService} from '../services/spot.service';

type Condition = {
  tide: TideDataServer;
};

type TideDataServer = {
  shift: number;
  state: string;
  timestamp: number;
}

@Component({
  selector: 'spot-detail',
  templateUrl: './spot-detail.component.html',
  styleUrls: [ './spot-detail.component.css' ]
})

export class SpotDetailComponent implements OnInit {
  public spot: Spot;
  public swellData: any[];
  public conditionData: Condition[];
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
          this.swellData = response.forecast;
          this.conditionData = response.conditions as Condition[];
        });
      }
    );
  }

  public getDate(date: number): string {
    return moment(date * 1000).format('DD MMM, hh:mm');
  }

  goBack(): void {
    this.location.back();
  }
}
