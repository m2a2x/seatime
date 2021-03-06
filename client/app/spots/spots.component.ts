import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import * as _ from 'lodash';
import {Country, Spot} from "../models/spot";
import {UserService} from "../services/user.service";
import {MapProvider} from "../services/map.provider";
import {APIService} from "../services/api.service";
import {SmartinputDropdownDirective} from "../smartinput/smartinput.dropdown.directive";
import {DataService} from "../services/data.service";
import {AuthenticationService} from "../services/auth.service";

type Reload = {
    spots: Spot[];
    countries: Country[];
    spot_count: number;
};

type List = {
    name: string;
};

@Component({
    selector: 'spots-section',
    templateUrl: './spots.component.html'
})
export class SpotsComponent implements OnInit {
    @ViewChild('bgmap')
    map: ElementRef;

    @ViewChild('dropdown')
    dropdown: SmartinputDropdownDirective;

    @ViewChild('search')
    search: ElementRef;



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
                private apiService: APIService,
                private dataService: DataService,
                public authService: AuthenticationService,
                private mapProvider: MapProvider,
                private route: ActivatedRoute,
                private router: Router) {
    }


    public ngOnInit(): void {
        this.route.params.subscribe(params => {

            let spotId: number = +params['id'];


            this.apiService.reload({fields: 'countries, spots, spot_count'}).then((response) => {
                let data: Reload = response as Reload;


                this.countries = _.sortBy<Country>(data.countries, 'name');
                this.spots = _.map(data.spots, (item: Spot): Spot => {
                    item.favourite = this.userService.isFavourite(item._id);
                    return item;
                });


                if (spotId) {
                    this.inited = true;
                    this.setSpot(this.findSpot(spotId));

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

    private setSpot(spot: Spot | undefined = undefined): void {
        this.selectedSpot = spot;
        this.dataService.setActiveSpot(spot);
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
        this.setSpot();

        this.router.navigate(['/spots']);
        this.firstLevelId = id;

        if (id) {
            this.mapProvider.setByName(name, 6);
            this.items = this.getByCountry(id);
            this.filter.name = '';
            setTimeout(()=> {
                this.search.nativeElement.focus();
            }, 0);
            return;
        }
        this.items = this.countries;
    }

    private findSpot(id: number): Spot {
        return _.find(this.spots, {_id: id}) as Spot;
    }

    public onInput(): void {
        if (this.firstLevelId && !this.filter.name.length) {
            let name: string = this.getCountry(this.firstLevelId);
            this.itemSelect(undefined);
            this.filter.name = name;
            this.mapProvider.reset();
        }
    }

    public toggleSpot(spot: Spot, e: Event): void {
        e.stopPropagation();
        let isRemove = spot.favourite;
        let action: string = isRemove ? 'removeFavouriteSpot' : 'addFavouriteSpot';

        if (!this.authService.isLoggedIn()) { return; }

        this.apiService[action](spot._id)
            .then((response: any)=> {
                if (response.isSuccessful) {
                    spot.favourite = isRemove ? false: true;
                }
                return;
            });
    }

    private gotoDetail(spot: Spot): void {
        this.setSpot(spot);
        this.router.navigate(['/spots', spot._id]);
        this.dropdown.hide();
    }

    public clearSearch(): void {
        this.itemSelect(undefined);
        this.mapProvider.reset();
    }
}
