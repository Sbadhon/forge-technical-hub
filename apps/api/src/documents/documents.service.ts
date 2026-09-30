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

  findAll() {
    return this.documentsRepository.find({
      order: {
        title: 'ASC',
      },
    });
  }

  create(document: DocumentEntity) {
    return this.documentsRepository.save(document);
  }
}