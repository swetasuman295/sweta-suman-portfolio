import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile/profile.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule,ProfileComponent],
  template: '<app-profile></app-profile>'
})
export class AppComponent {
  title = 'sweta-suman-portfolio';
}