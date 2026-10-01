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
    originalName?: string | null;
    fileSize?: string | null;
  }) {
    return this.http.post(this.apiUrl, document);
  }

  upload(
    file: File,
    metadata: {
      id: string;
      title: string;
      product: string;
      type: string;
      version: string;
    },
  ) {
    const formData = new FormData();

    formData.append('file', file);
    formData.append('id', metadata.id);
    formData.append('title', metadata.title);
    formData.append('product', metadata.product);
    formData.append('type', metadata.type);
    formData.append('version', metadata.version);

    return this.http.post(`${this.apiUrl}/upload`, formData);
  }
}
