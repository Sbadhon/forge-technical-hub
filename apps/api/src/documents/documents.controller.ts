import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { DocumentsService } from './documents.service.js';

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Get()
  findAll(@Query('search') search?: string) {
    return this.documentsService.findAll(search);
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