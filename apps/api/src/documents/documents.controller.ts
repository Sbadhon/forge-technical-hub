import { Controller, Get } from '@nestjs/common';
import { DocumentsService } from './documents.service.js';


@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Get()
  findAll() {
    return this.documentsService.findAll();
  }
}