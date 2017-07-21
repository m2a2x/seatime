import {Component, Input} from '@angular/core';
import {Tide} from "../services/data.service";
import * as moment from 'moment';
import * as _ from 'lodash';

type TideT = {
    state: string,
    time: string
};

@Component({
    selector: 'tide-chart',
    templateUrl: './tide-chart.component.html',
    styleUrls: ['./tide-chart.component.css']
})
export class TideChartComponent {
    public _tides: TideT[];

    @Input()
    set tides(tides: Tide[]) {
        this._tides = _.map<Tide, TideT>(tides, (tide: Tide): TideT => {
            return {
                state: tide.state,
                time: moment.unix(tide.timestamp).locale('en').format('hh:mm a')
            };
        });
    }

    @Input('size') size: number;

    constructor() {}
}
