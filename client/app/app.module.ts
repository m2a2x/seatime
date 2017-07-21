import {NgModule}      from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule}   from '@angular/forms';
import {CookieXSRFStrategy, HttpModule, RequestOptions, XSRFStrategy}    from '@angular/http';

import {BsDropdownModule} from 'ngx-bootstrap';

import {AppRoutingModule}       from './app-routing.module';
import {AppComponent}           from './app.component';
import {DashboardComponent}     from './dashboard/dashboard.component';
import {SpotsComponent}         from './spots/spots.component';
import {SpotDetailComponent}    from './spot-detail/spot-detail.component';
import {UserService}            from './services/user.service';
import {NavigationComponent}    from './navigation/navigation.component';
import {AuthenticationService}  from './services/auth.service';
import {AuthGuard}              from './guards/auth.guard';
import {APIService}             from "./services/api.service";
import {MapProvider}            from "./services/map.provider";
import {DataService}            from "./services/data.service";
import {SmartinputModule} from "./smartinput/smartinput.module";

import 'lodash';
import 'rxjs/add/operator/toPromise';
import {DashboardCardComponent} from "./dashboard-card/dashboard-card.component";
import {TideChartComponent} from "./tide-chart/tide-chart.component";


@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        AppRoutingModule,
        SmartinputModule.forRoot(),
        BsDropdownModule.forRoot()
    ],
    declarations: [
        AppComponent,
        DashboardComponent,
        DashboardCardComponent,
        TideChartComponent,
        SpotDetailComponent,
        SpotsComponent,
        NavigationComponent
    ],
    providers: [
        APIService,
        DataService,
        AuthenticationService,
        AuthGuard,
        UserService,
        MapProvider,
        {
            provide: XSRFStrategy,
            useValue: IlmsCookieStrategy()
        }
        /*,
         {
         provide: APP_INITIALIZER,
         useFactory: (apiService: APIService, userService: UserService, spotService: SpotService) => () => {
         return apiService.reload().then((response: Reload): boolean => {
         userService.set(response.user);
         spotService.set(response.spots, response.countries);
         return true;
         });
         },
         deps: [APIService, UserService, SpotService],
         multi: true
         }
         */
    ],
    bootstrap: [AppComponent]
})

export class AppModule {
}


export function IlmsCookieStrategy() {
    return new CookieXSRFStrategy('XSRF-TOKEN', 'X-XSRF-Token');
}