import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { HttpModule }    from '@angular/http';

import { AppRoutingModule } from './app-routing.module';

// Imports for loading & configuring the in-memory web api
// import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
// import { InMemoryDataService }  from './in-memory-data.service';

import { AppComponent }         from './app.component';
import { DashboardComponent }   from './dashboard/dashboard.component';
import { SpotesComponent }      from './spots/spots.component';
import { SpotDetailComponent }  from './spot-detail/spot-detail.component';
import { SpotService }          from './services/spot.service';
// import { SpotSearchComponent }  from './spot-search.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    // InMemoryWebApiModule.forRoot(InMemoryDataService),
    AppRoutingModule
  ],
  declarations: [
    AppComponent,
    DashboardComponent,
    SpotDetailComponent,
    SpotesComponent,
    // SpotSearchComponent
  ],
  providers: [ SpotService ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
