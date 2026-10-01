import { Component, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

import { DocumentsService } from './documents.service';

@Component({
  selector: 'app-root',
  imports: [FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly documentsService = inject(DocumentsService);

  protected selectedFile: File | null = null;

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

  protected newDocument = this.createEmptyDocument();

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

  protected selectFile(event: Event) {
    const input = event.target as HTMLInputElement;

    this.selectedFile = input.files?.[0] ?? null;
  }

  protected canUpload() {
    return (
      this.selectedFile !== null &&
      this.newDocument.id.trim() !== '' &&
      this.newDocument.title.trim() !== '' &&
      this.newDocument.product.trim() !== '' &&
      this.newDocument.type.trim() !== '' &&
      this.newDocument.version.trim() !== ''
    );
  }

  protected uploadDocument(uploadForm: NgForm, fileInput: HTMLInputElement) {
    if (!this.canUpload() || !this.selectedFile) {
      return;
    }

    this.documentsService.upload(this.selectedFile, this.newDocument).subscribe(() => {
      const resetDocument = this.createEmptyDocument();

      this.newDocument = resetDocument;
      this.selectedFile = null;
      fileInput.value = '';

      uploadForm.resetForm(resetDocument);

      this.loadDocuments();
    });
  }

  private createEmptyDocument() {
    return {
      id: '',
      title: '',
      product: '',
      type: '',
      version: '1.0',
    };
  }

  private loadDocuments(search?: string) {
    this.documentsService.findAll(search).subscribe((documents) => this.documents.set(documents));
  }
}
