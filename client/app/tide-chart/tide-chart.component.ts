import {Component, Input} from '@angular/core';
import {Tide} from "../services/data.service";
import * as moment from 'moment';

@Component({
    selector: 'tide-chart',
    templateUrl: './tide-chart.component.html',
    styleUrls: ['./tide-chart.component.css']
})
export class TideChartComponent {
    @Input('tides') tides: Tide[];
    @Input('size') size: number;

    constructor() {}

    public getDate(date: number): string {
        return moment.unix(date).format('hh:mm');
    }
}
