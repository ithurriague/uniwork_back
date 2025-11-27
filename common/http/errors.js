import { HTTP_STATUS } from './status.js';

export class HttpError extends Error {
    constructor(message, status) {
        super(message);
        this.name = this.constructor.name;
        this.status = status;
        Error.captureStackTrace?.(this, this.constructor);
    }
}

export class BadRequestError extends HttpError {
    constructor(message = 'Bad Request') {
        super(message, HTTP_STATUS.BAD_REQUEST);
    }
}

export class UnauthorizedError extends HttpError {
    constructor(message = 'Unauthorized') {
        super(message, HTTP_STATUS.UNAUTHORIZED);
    }
}

export class ForbiddenError extends HttpError {
    constructor(message = 'Forbidden') {
        super(message, HTTP_STATUS.FORBIDDEN);
    }
}

export class NotFoundError extends HttpError {
    constructor(message = 'Not Found') {
        super(message, HTTP_STATUS.NOT_FOUND);
    }
}

export class ConflictError extends HttpError {
    constructor(message = 'Conflict') {
        super(message, HTTP_STATUS.CONFLICT);
    }
}

export class UnprocessableEntityError extends HttpError {
    constructor(message = 'Unprocessable Entity') {
        super(message, HTTP_STATUS.UNPROCESSABLE_ENTITY);
    }
}

export class InternalServerError extends HttpError {
    constructor(message = 'Internal Server Error') {
        super(message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
}
