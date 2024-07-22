const CustomAPIError = require("./CustomAPIError");

const errorHandler = (err,req,res)=>{
    if(err instanceof CustomAPIError)
        res.status(500).json({messgae:err.message});
    else
        res.status(500).json({messgae:err.message});
}