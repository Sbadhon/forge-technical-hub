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
}
