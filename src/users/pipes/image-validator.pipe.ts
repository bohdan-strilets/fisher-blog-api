import { FileTypeValidator, MaxFileSizeValidator, ParseFilePipe } from '@nestjs/common';

const allowedFileTypes = /(jpeg|png|gif|webp)/;
const maxSize = 5 * 1024 * 1024;

export const imageValidator = new ParseFilePipe({
  validators: [
    new MaxFileSizeValidator({ maxSize }),
    new FileTypeValidator({ fileType: allowedFileTypes }),
  ],
});
