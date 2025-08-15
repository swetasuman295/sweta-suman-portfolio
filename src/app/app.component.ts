import { Component } from '@angular/core';
import { ProfileComponent } from './profile/profile.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ProfileComponent],
  template: '<app-profile></app-profile>'
})
export class AppComponent {
  title = 'sweta-suman-portfolio';
}