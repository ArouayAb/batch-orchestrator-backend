import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from "@nestjs/common";
import { BaseExceptionFilter } from "@nestjs/core";
import { Request, Response } from 'express';
import { IncoherentPasswordError } from "../exceptions/incoherent-password.exception";

@Catch(IncoherentPasswordError)
export class IncoherentPasswordExceptionFilter implements ExceptionFilter {

    private readonly logger = new Logger(IncoherentPasswordError.name);

    catch(exception: IncoherentPasswordError, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = HttpStatus.FORBIDDEN;

        this.logger.error(exception.message)

        response
            .status(status)
            .json({
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url
            });   
    }
}