import { Component, OnInit } from '@angular/core';
import { Router }            from '@angular/router';

import { Observable }        from 'rxjs/Observable';
import { Subject }           from 'rxjs/Subject';

// Observable class extensions
import 'rxjs/add/observable/of';

// Observable operators
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

import { SpotSearchService } from './../services/spot-search.service';
import { Spot } from '../models/spot';

@Component({
  selector: 'spot-search',
  templateUrl: './spot-search.component.html',
  styleUrls: [ './spot-search.component.css' ],
  providers: [SpotSearchService]
})
export class SpotSearchComponent implements OnInit {
  spotes: Observable<Spot[]>;
  private searchTerms = new Subject<string>();

  constructor(
    private spotSearchService: SpotSearchService,
    private router: Router) {}

  // Push a search term into the observable stream.
  search(term: string): void {
    this.searchTerms.next(term);
  }

  ngOnInit(): void {
    this.spotes = this.searchTerms
      .debounceTime(300)        // wait 300ms after each keystroke before considering the term
      .distinctUntilChanged()   // ignore if next search term is same as previous
      .switchMap(term => term   // switch to new observable each time the term changes
        // return the http search observable
        ? this.spotSearchService.search(term)
        // or the observable of empty spotes if there was no search term
        : Observable.of<Spot[]>([]))
      .catch(error => {
        // TODO: add real error handling
        console.log(error);
        return Observable.of<Spot[]>([]);
      });
  }

  gotoDetail(spot: Spot): void {
    let link = ['/detail', spot.id];
    this.router.navigate(link);
  }
}
