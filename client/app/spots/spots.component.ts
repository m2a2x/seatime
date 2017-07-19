import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Location} from '@angular/common';
import {ActivatedRoute} from "@angular/router";
import * as _ from 'lodash';
import {Country, Spot} from "../services/data.service";
import {UserService} from "../services/user.service";
import {MapProvider} from "../services/map.provider";
import {DataService} from "../services/data.service";
import {APIService} from "../services/api.service";
import {SpotDetailComponent} from "../spot-detail/spot-detail.component";

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
    @ViewChild('detail') detail: SpotDetailComponent;


    public items: Spot[] | Country[];
    public spots: Spot[] = [];
    public countries: Country[] = [];

    public firstLevelId: number | undefined;
    public spot_count: number;
    public inited: boolean;
    public selectedSpot: Spot | undefined;

    public filter: List = {
        name: ''
    };

    constructor(
                public userService: UserService,
                private dataService: DataService,
                private apiService: APIService,
                private mapProvider: MapProvider,
                private location: Location,
                private route: ActivatedRoute,) {
    }


    public ngOnInit(): void {
        this.route.params.subscribe(params => {

            let spotId: number = +params['id'];


            this.dataService.reload({fields: 'countries, spots, spot_count'}).then((response: Reload) => {
                let data: Reload = response as Reload;


                this.countries = _.sortBy<Country>(data.countries, 'name');
                this.spots = _.map(data.spots, (item: Spot): Spot => {
                    item.favourite = this.userService.isFavourite(item._id);
                    return item;
                });


                if (spotId) {
                    this.inited = true;
                    this.selectedSpot = this.findSpot(spotId);
                    this.firstLevelId = this.selectedSpot._country;
                    this.items = this.getByCountry(this.firstLevelId);
                    this.itemSelect(this.selectedSpot._id, this.selectedSpot.name);
                } else  {
                    this.items = this.countries;
                }
                this.spot_count = data.spot_count;
            });
            this.mapProvider.set(this.map.nativeElement);
        });
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

    public itemSelect(id: number | undefined, name =''): void {
        this.inited = true;

        this.filter.name = name;
        if (id && this.firstLevelId) {
            this.gotoDetail(this.findSpot(id));
            return;
        }
        this.selectedSpot = undefined;
        this.location.go('/spots');
        this.firstLevelId = id;

        if (id) {
            this.mapProvider.setByName(name, 6);
            this.items = this.getByCountry(id);
            this.filter.name = '';
            return;
        }
        this.items = this.countries;
    }

    private findSpot(id: number): Spot {
        return _.find(this.spots, {_id: id}) as Spot;
    }

    public onInput($event: EventInit): void {
        if (this.firstLevelId && !this.filter.name.length) {
            let name: string = this.getCountry(this.firstLevelId);
            this.itemSelect(undefined);
            this.filter.name = name;
            this.mapProvider.reset();
        }
        console.log($event);
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

    private gotoDetail(spot: Spot): void {
        this.selectedSpot = spot;
        this.location.go('/spots/' + spot._id);
    }
}
