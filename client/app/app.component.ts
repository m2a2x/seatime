import { Component }          from '@angular/core';

@Component({
  selector: 'my-app',
  template: `
    <navigation></navigation>
    <router-outlet></router-outlet>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
}
