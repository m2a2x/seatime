import {APP_INITIALIZER, NgModule}      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { HttpModule }    from '@angular/http';

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
import {APIService} from "./services/api.service";


@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule
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
    {
      provide: APP_INITIALIZER,
      useFactory: (userService: UserService, spotService: SpotService) => () => {
        return Promise.all([userService.initUser(), spotService.initSpots()]);
      },
      deps: [UserService, SpotService],
      multi: true
    }
  ],
  bootstrap: [ AppComponent ]
})

export class AppModule { }
