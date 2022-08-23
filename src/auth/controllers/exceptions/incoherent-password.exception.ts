export class IncoherentPasswordError extends Error {
    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, IncoherentPasswordError.prototype);
    }
    
}