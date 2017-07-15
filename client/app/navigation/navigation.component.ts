import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from "../services/auth.service";

@Component({
  selector: 'navigation',
  templateUrl: './navigation.component.html',
  styleUrls: [ './navigation.component.css' ]
})
export class NavigationComponent {
  constructor(private authService: AuthenticationService) { }

  public isLoggedIn(): boolean {
    return this.authService.isLoggedIn();;
  }
}
