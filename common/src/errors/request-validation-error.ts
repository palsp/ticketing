import { ValidationError } from 'express-validator';
import { CustomError } from './custom-error'

// interface CustomError {
//     statusCode : number,
//     serializeError(): {
//         message : string;
//         field?: string;
//     }[]
// }

export class RequestValidationError extends CustomError  /*implements CustomError*/ {
    statusCode = 400;
    constructor(public errors: ValidationError[]) {
        super('Invalid Request parameters');

        // Only because we are extending a built in class
        Object.setPrototypeOf(this, RequestValidationError.prototype)
    }

    serializeErrors() {
        return this.errors.map(err => {
            return { message: err.msg, field: err.param }
        })
    }
}