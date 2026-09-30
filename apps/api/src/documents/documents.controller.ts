import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'node:path';

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

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: 'uploads/documents',
        filename: (_request, file, callback) => {
          const extension = extname(file.originalname);
          const baseName = file.originalname
            .replace(extension, '')
            .replace(/[^a-zA-Z0-9-_]/g, '-')
            .toLowerCase();

          callback(null, `${Date.now()}-${baseName}${extension}`);
        },
      }),
      fileFilter: (_request, file, callback) => {
        callback(null, file.mimetype === 'application/pdf');
      },
    }),
  )
  upload(
    @UploadedFile() file: Express.Multer.File,
    @Body()
    metadata: {
      id: string;
      title: string;
      product: string;
      type: string;
      version: string;
    },
  ) {
    return this.documentsService.create({
      ...metadata,
      originalName: file.originalname,
      storedFilename: file.filename,
      filePath: file.path,
      fileSize: file.size.toString(),
      mimeType: file.mimetype,
    });
  }
}
