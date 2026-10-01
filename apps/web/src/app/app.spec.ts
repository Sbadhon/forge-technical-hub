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

    expect(
      compiled.querySelector('h1')?.textContent,
    ).toContain('Forge');
  });

  it('should enable upload when metadata and PDF are selected', async () => {
    const fixture = TestBed.createComponent(App);

    const initialRequest = httpTesting.expectOne(
      'http://localhost:3000/api/documents',
    );

    initialRequest.flush([]);

    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;

    setInputValue(compiled, 'id', 'test-document');
    setInputValue(compiled, 'title', 'Test Document');
    setInputValue(compiled, 'product', 'Test Product');
    setInputValue(compiled, 'type', 'Technical Guide');

    const fileInput = compiled.querySelector(
      '#document-file',
    ) as HTMLInputElement;

    const file = new File(
      ['pdf'],
      'test.pdf',
      {
        type: 'application/pdf',
      },
    );

    Object.defineProperty(fileInput, 'files', {
      value: [file],
      configurable: true,
    });

    fileInput.dispatchEvent(
      new Event('change', {
        bubbles: true,
      }),
    );

    fixture.detectChanges();
    await fixture.whenStable();

    const uploadButton = compiled.querySelector(
      '.upload-form button[type="submit"]',
    ) as HTMLButtonElement;

    expect(uploadButton.disabled).toBe(false);
  });

  it('should clear the upload form after successful upload', async () => {
    const fixture = TestBed.createComponent(App);

    const initialRequest = httpTesting.expectOne(
      'http://localhost:3000/api/documents',
    );

    initialRequest.flush([]);

    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;

    setInputValue(compiled, 'id', 'test-document');
    setInputValue(compiled, 'version', '2.0');
    setInputValue(compiled, 'title', 'Test Document');
    setInputValue(compiled, 'product', 'Test Product');
    setInputValue(compiled, 'type', 'Technical Guide');

    const fileInput = compiled.querySelector(
      '#document-file',
    ) as HTMLInputElement;

    const file = new File(
      ['pdf'],
      'test.pdf',
      {
        type: 'application/pdf',
      },
    );

    Object.defineProperty(fileInput, 'files', {
      value: [file],
      configurable: true,
    });

    fileInput.dispatchEvent(
      new Event('change', {
        bubbles: true,
      }),
    );

    fixture.detectChanges();
    await fixture.whenStable();

    const form = compiled.querySelector(
      '.upload-form',
    ) as HTMLFormElement;

    form.dispatchEvent(
      new Event('submit', {
        bubbles: true,
        cancelable: true,
      }),
    );

    const uploadRequest = httpTesting.expectOne(
      'http://localhost:3000/api/documents/upload',
    );

    expect(uploadRequest.request.method).toBe('POST');

    uploadRequest.flush({
      id: 'test-document',
    });

    const reloadRequest = httpTesting.expectOne(
      'http://localhost:3000/api/documents',
    );

    reloadRequest.flush([]);

    fixture.detectChanges();
    await fixture.whenStable();

    expect(getInput(compiled, 'id').value).toBe('');
    expect(getInput(compiled, 'title').value).toBe('');
    expect(getInput(compiled, 'product').value).toBe('');
    expect(getInput(compiled, 'type').value).toBe('');
    expect(getInput(compiled, 'version').value).toBe('1.0');

    expect(fileInput.value).toBe('');

    expect(
      compiled.querySelector('.selected-file'),
    ).toBeNull();
  });
});

function setInputValue(
  element: HTMLElement,
  name: string,
  value: string,
) {
  const input = getInput(element, name);

  input.value = value;

  input.dispatchEvent(
    new Event('input', {
      bubbles: true,
    }),
  );
}

function getInput(
  element: HTMLElement,
  name: string,
) {
  return element.querySelector(
    `input[name="${name}"]`,
  ) as HTMLInputElement;
}