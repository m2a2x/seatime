import { Component, OnInit } from '@angular/core';

import { Spot }                from '../models/spot';
import { SpotService }         from '../services/spot.service';
import {UserService} from "../services/user.service";
import {Router} from "@angular/router";

@Component({
  selector: 'my-spotes',
  templateUrl: './spots.component.html',
  styleUrls: [ './spots.component.css' ]
})
export class SpotsComponent implements OnInit {
  private spots: Spot[];

  constructor(
    private spotService: SpotService,
    private userService: UserService,
    private router: Router) { }


  ngOnInit(): void {
    this.spots = this.spotService.getSpots();
  }

  public addSpot(spot: Spot, e: Event): void {
    e.stopPropagation();
    this.userService.addToFavourite(spot);
  }

  public gotoDetail(id: number): void {
    this.router.navigate(['/detail', id]);
  }
}
