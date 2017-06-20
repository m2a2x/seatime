import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from "../services/auth.service";

@Component({
  selector: 'navigation',
  templateUrl: './navigation.component.html',
  styleUrls: [ './navigation.component.css' ]
})
export class NavigationComponent implements OnInit {
  private isLoggedIn: boolean = false;
  constructor(private authService: AuthenticationService) { }

  public ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
  }
}
