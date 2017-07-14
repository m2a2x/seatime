import {APP_INITIALIZER, NgModule}      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { HttpModule }    from '@angular/http';
import { BsDropdownModule } from 'ngx-bootstrap';

import { AppRoutingModule }       from './app-routing.module';
import { AppComponent }           from './app.component';
import { DashboardComponent }     from './dashboard/dashboard.component';
import { SpotsComponent }         from './spots/spots.component';
import { SpotDetailComponent }    from './spot-detail/spot-detail.component';
import { SpotService }            from './services/spot.service';
import { UserService }            from './services/user.service';
import { NavigationComponent }    from './navigation/navigation.component';
import { AuthenticationService }  from './services/auth.service';
import { AuthGuard }              from './guards/auth.guard';
import {APIService, Reload} from "./services/api.service";
import {MapProvider} from "./services/map.provider";


@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    BsDropdownModule.forRoot()
  ],
  declarations: [
    AppComponent,
    DashboardComponent,
    SpotDetailComponent,
    SpotsComponent,
    NavigationComponent
  ],
  providers: [
    APIService,
    AuthenticationService,
    AuthGuard,
    SpotService,
    UserService,
    MapProvider,
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
  ],
  bootstrap: [ AppComponent ]
})

export class AppModule { }
