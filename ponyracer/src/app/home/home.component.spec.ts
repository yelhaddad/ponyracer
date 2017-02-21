import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { AppModule } from '../app.module';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {

  beforeEach(() => TestBed.configureTestingModule({
    imports: [AppModule, RouterTestingModule]
  }));

  it('display the title and quote', () => {
    const fixture = TestBed.createComponent(HomeComponent);
    const element = fixture.nativeElement;

    const title = element.querySelector('h1');
    expect(title).not.toBeNull('You should have an `h1` element to display the title');
    expect(title.textContent).toContain('Ponyracer Always a pleasure to bet on ponies');

    const subtitle = element.querySelector('small');
    expect(subtitle).not.toBeNull('You should have a `small` element to display the subtitle');
    expect(subtitle.textContent).toContain('Always a pleasure to bet on ponies');
  });

  it('display a link to go the races and another to register', () => {
    const fixture = TestBed.createComponent(HomeComponent);
    const element = fixture.nativeElement;

    fixture.detectChanges();

    const button = element.querySelector('a[href="/races"]');
    expect(button).not.toBeNull('You should have an `a` element to display the link to the races. Maybe you forgot to use `routerLink`?');
    expect(button.textContent).toContain('Races', 'The link should have a text');

    const buttonRegister = element.querySelector('a[href="/register"]');
    expect(buttonRegister)
      .not.toBeNull('You should have an `a` element to display the link to the register page. Maybe you forgot to use `routerLink`?');
    expect(buttonRegister.textContent).toContain('Register', 'The link should have a text');
  });
});
