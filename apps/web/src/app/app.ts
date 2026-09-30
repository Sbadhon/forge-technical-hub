import { Component, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/api/documents';

  protected readonly documents = signal<
    {
      id: string;
      title: string;
      product: string;
      type: string;
      version: string;
    }[]
  >([]);

  protected searchTerm = '';

  protected newDocument = {
    id: '',
    title: '',
    product: '',
    type: '',
    version: '1.0',
  };

  constructor() {
    this.loadDocuments();
  }

  protected searchDocuments() {
    this.loadDocuments(this.searchTerm);
  }

  protected clearSearch() {
    this.searchTerm = '';
    this.loadDocuments();
  }

  protected createDocument() {
    this.http.post(this.apiUrl, this.newDocument).subscribe(() => {
      this.newDocument = {
        id: '',
        title: '',
        product: '',
        type: '',
        version: '1.0',
      };

      this.loadDocuments(this.searchTerm);
    });
  }

  private loadDocuments(search?: string) {
    let params = new HttpParams();

    const term = search?.trim();

    if (term) {
      params = params.set('search', term);
    }

    this.http
      .get<
        {
          id: string;
          title: string;
          product: string;
          type: string;
          version: string;
        }[]
      >(this.apiUrl, { params })
      .subscribe((documents) => this.documents.set(documents));
  }
}