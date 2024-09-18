import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  Query,
} from '@nestjs/common';
import { FileService } from './file.service';
// import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { Public } from 'src/auth/jwt-auth.guard';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import configuration from '../config/configuration';
import * as fs from 'fs';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Controller('file')
export class FileController {
  constructor(
    private readonly httpService: HttpService,
    private readonly fileService: FileService,
  ) {}

  @Public()
  @Post('upload')
  @UseInterceptors(AnyFilesInterceptor())
  upload(@UploadedFiles() files: Array<Express.Multer.File>) {
    console.log(files);

    files.forEach((file) => {
      this.saveBufferToFile(file.buffer, file.originalname);
    });
    return this.fileService.create(files);
  }

  saveBufferToFile(buffer: Buffer, filename: string): Promise<void> {
    const filePath = configuration.upload.path + '\\' + filename;
    return new Promise((resolve, reject) => {
      fs.writeFile(filePath, buffer, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  @Public()
  @Get('search')
  async search(@Query('k') k: string) {
    const checkResultObservable = this.httpService.get(
      `https://yanchu.maoyan.com/myshow/ajax/search/0;st=0;p=1;s=20;tft=0?k=${k}`,
    );
    const res = await lastValueFrom(checkResultObservable);
    return res.data;
  }

  @Get('performance')
  performance() {
    return this.fileService.findAll();
  }

  @Get('tickets')
  tickets() {
    return this.fileService.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    console.log(id);

    return this.fileService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFileDto: UpdateFileDto) {
    return this.fileService.update(+id, updateFileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fileService.remove(+id);
  }
}
