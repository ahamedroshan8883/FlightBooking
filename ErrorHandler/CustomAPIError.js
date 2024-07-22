class CustomAPIError extends Error{
    constructor(message,statusCode){
        super(message);
        this.stausCode = statusCode;
    }
}
module.exports = CustomAPIError;