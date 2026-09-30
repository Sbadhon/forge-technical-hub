import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { App } from './app';

describe('App', () => {
  let httpTesting: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);

    const request = httpTesting.expectOne(
      'http://localhost:3000/api/documents',
    );

    request.flush([]);

    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the Forge title', async () => {
    const fixture = TestBed.createComponent(App);

    const request = httpTesting.expectOne(
      'http://localhost:3000/api/documents',
    );

    request.flush([]);

    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('h1')?.textContent).toContain('Forge');
  });
});