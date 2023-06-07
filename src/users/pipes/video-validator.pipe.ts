import { FileTypeValidator, MaxFileSizeValidator, ParseFilePipe } from '@nestjs/common';

const allowedFileTypes = /(mp4|webm|ogg)/;
const maxSize = 25 * 1024 * 1024;

export const videoValidator = new ParseFilePipe({
  validators: [
    new MaxFileSizeValidator({ maxSize }),
    new FileTypeValidator({ fileType: allowedFileTypes }),
  ],
});
