import { Component, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly http = inject(HttpClient);

  protected readonly documents = signal<
    {
      id: string;
      title: string;
      product: string;
      type: string;
      version: string;
    }[]
  >([]);

  constructor() {
    this.http
      .get<
        {
          id: string;
          title: string;
          product: string;
          type: string;
          version: string;
        }[]
      >('http://localhost:3000/api/documents')
      .subscribe((documents) => this.documents.set(documents));
  }
}