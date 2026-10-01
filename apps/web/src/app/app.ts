import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { DocumentsService } from './documents.service';

@Component({
  selector: 'app-root',
  imports: [FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected selectedFile: File | null = null;
  private readonly documentsService = inject(DocumentsService);

  protected readonly documents = signal<
    {
      id: string;
      title: string;
      product: string;
      type: string;
      version: string;
      originalName?: string | null;
      fileSize?: string | null;
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
    this.documentsService.create(this.newDocument).subscribe(() => {
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
    this.documentsService.findAll(search).subscribe((documents) => this.documents.set(documents));
  }

  protected selectFile(event: Event) {
    const input = event.target as HTMLInputElement;

    this.selectedFile = input.files?.[0] ?? null;
  }

  protected uploadDocument() {
    if (!this.selectedFile) {
      return;
    }

    this.documentsService.upload(this.selectedFile, this.newDocument).subscribe(() => {
      this.selectedFile = null;

      this.newDocument = {
        id: '',
        title: '',
        product: '',
        type: '',
        version: '1.0',
      };

      this.loadDocuments();
    });
  }
}
