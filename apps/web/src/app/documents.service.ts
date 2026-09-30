import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DocumentsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/api/documents';

  findAll(search?: string) {
    let params = new HttpParams();

    const term = search?.trim();

    if (term) {
      params = params.set('search', term);
    }

    return this.http.get<
      {
        id: string;
        title: string;
        product: string;
        type: string;
        version: string;
      }[]
    >(this.apiUrl, { params });
  }

  create(document: {
    id: string;
    title: string;
    product: string;
    type: string;
    version: string;
  }) {
    return this.http.post(this.apiUrl, document);
  }
}