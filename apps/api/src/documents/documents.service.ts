import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { DocumentEntity } from './document.entity.js';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(DocumentEntity)
    private readonly documentsRepository: Repository<DocumentEntity>,
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
        `,
        {
          search: `%${term}%`,
        },
      );
    }

    return query.getMany();
  }

  create(document: DocumentEntity) {
    return this.documentsRepository.save(document);
  }
}