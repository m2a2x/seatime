import {Component, ElementRef, OnInit, Type, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import * as _ from 'lodash';
import {Country, Spot} from "../services/data.service";
import {UserService} from "../services/user.service";
import {MapProvider} from "../services/map.provider";
import {DataService} from "../services/data.service";
import {APIService} from "../services/api.service";

type Reload = {
    spots: Spot[];
    countries: Country[];
    spot_count: number;
};

type List = {
    name: string;
};

@Component({
    selector: 'places-section',
    templateUrl: './spots.component.html',
    styleUrls: ['./spots.component.css']
})
export class SpotsComponent implements OnInit {
    @ViewChild('bgmap') map: ElementRef;


    public items: Spot[] | Country[];
    public spots: Spot[] = [];
    public countries: Country[] = [];

    public firstLevelId: number | undefined;
    public spot_count: number;

    public filter: List = {
        name: ''
    };

    constructor(
                public userService: UserService,
                private dataService: DataService,
                private apiService: APIService,
                private mapProvider: MapProvider,
                private router: Router) {
    }


    public ngOnInit(): void {
        this.dataService.reload({fields: 'countries, spots, spot_count'}).then((response: Reload) => {
            let data: Reload = response as Reload;

            this.countries = _.sortBy<Country>(data.countries, 'name');
            this.spots = _.map(data.spots, (item: Spot): Spot => {
                item.favourite = this.userService.isFavourite(item._id);
                return item;
            });
            this.items = this.countries;
            this.spot_count = data.spot_count;
        });
        this.mapProvider.set(this.map.nativeElement);
    }

    private getByCountry(id: number): Spot[]  {
        return _.filter<Spot>(this.spots, {
            _country: id
        });
    }

    public getCountry(id: number): string {
        let country: Country | undefined;
        country = _.find(this.countries, {_id: id});
        if (country) {
            return country.name;
        }
        return '';
    }

    public itemSelect(id: number | undefined): void {
        if (id && this.firstLevelId) {
            this.gotoDetail(id);
            return;
        }

        this.firstLevelId = id;
        if (id) {
            this.items = this.getByCountry(id);
            return;
        }
        this.items = this.countries;
    }


    public toggleSpot(spot: Spot, e: Event): void {
        e.stopPropagation();
        let isRemove = spot.favourite;
        let action: string = isRemove ? 'removeFavouriteSpot' : 'addFavouriteSpot';

        this.apiService[action](spot._id)
            .then((response: any)=> {
                if (response.isSuccessful) {
                    spot.favourite = isRemove ? false: true;
                }
                return;
            });
    }

    private gotoDetail(id: number): void {
        this.router.navigate(['/detail', id]);
    }

    public clearFirstLevel(): void {
        this.itemSelect(undefined);
    }
}
