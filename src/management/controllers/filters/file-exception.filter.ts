import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from "@nestjs/common";
import { Request, Response } from 'express';
import { UnsupportedLanguageException } from "src/management/exceptions/unsupported-language.exception";
import { QueryFailedError } from "typeorm";

@Catch(UnsupportedLanguageException)
export class FileExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(FileExceptionFilter.name);

  catch(exception: UnsupportedLanguageException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = HttpStatus.BAD_REQUEST;

    this.logger.error(exception.message)
    
    response
      .status(status)
      .json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        message: exception.message
      });
  }
}