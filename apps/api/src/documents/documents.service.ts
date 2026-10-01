import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { DocumentChunkEntity } from './document-chunk.entity.js';
import { DocumentEntity } from './document.entity.js';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(DocumentEntity)
    private readonly documentsRepository: Repository<DocumentEntity>,

    @InjectRepository(DocumentChunkEntity)
    private readonly documentChunksRepository: Repository<DocumentChunkEntity>,
  ) {}

  findAll(search?: string) {
    const query = this.documentsRepository
      .createQueryBuilder('document')
      .orderBy('document.title', 'ASC');

    const term = search?.trim();

    if (term) {
      query.where(
        `
          document.title ILIKE :search
          OR document.product ILIKE :search
          OR document.type ILIKE :search
          OR document.extractedText ILIKE :search
        `,
        {
          search: `%${term}%`,
        },
      );
    }

    return query.getMany();
  }

  create(document: Partial<DocumentEntity>) {
    return this.documentsRepository.save(
      this.documentsRepository.create(document),
    );
  }

  async createChunks(documentId: string, text: string) {
    const normalizedText = text
      .replace(/\r/g, '')
      .replace(/[ \t]+/g, ' ')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    const chunkSize = 1200;
    const overlap = 200;
    const chunks: DocumentChunkEntity[] = [];

    let start = 0;
    let chunkIndex = 0;

    while (start < normalizedText.length) {
      const end = Math.min(
        start + chunkSize,
        normalizedText.length,
      );

      const content = normalizedText
        .slice(start, end)
        .trim();

      if (content) {
        chunks.push(
          this.documentChunksRepository.create({
            documentId,
            chunkIndex,
            content,
            pageNumber: null,
          }),
        );

        chunkIndex++;
      }

      if (end === normalizedText.length) {
        break;
      }

      start = end - overlap;
    }

    await this.documentChunksRepository.delete({
      documentId,
    });

    if (chunks.length === 0) {
      return [];
    }

    return this.documentChunksRepository.save(chunks);
  }
}