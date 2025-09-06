import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { Component } from '@angular/core';
import { ProfileComponent } from './profile/profile.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  template: '<div>Mock Profile Component</div>'
})
class MockProfileComponent { }

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: any;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
       providers: []
    })
    .overrideComponent(AppComponent, {
      remove: { imports: [ProfileComponent] },
      add: { imports: [MockProfileComponent] }
    })
    .compileComponents();
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'sweta-suman-portfolio' title`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('sweta-suman-portfolio');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Hello, sweta-suman-portfolio');
  });
});
