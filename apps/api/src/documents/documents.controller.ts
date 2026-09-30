import { Body, Controller, Get, Post } from '@nestjs/common';
import { DocumentsService } from './documents.service.js';

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Get()
  findAll() {
    return this.documentsService.findAll();
  }

  @Post()
  create(
    @Body()
    document: {
      id: string;
      title: string;
      product: string;
      type: string;
      version: string;
    },
  ) {
    return this.documentsService.create(document);
  }
}