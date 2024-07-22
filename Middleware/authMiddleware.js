const jwt = require('jsonwebtoken');
const CustomAPIError = require('../ErrorHandler/CustomAPIError');


const authMiddleware = async(req,res,next)=>{
    const authHeader = req.headers.authorization;

    console.log(authHeader);
    if(!authHeader || !authHeader.startsWith('Bearer')){
        next(new CustomAPIError('Not Aurthorization',401))
    }else{
        try{
            const token = await authHeader.split(" ")[1];
            const decoded = jwt.verify(token,process.env.JSON_SECRETKEY);
            const {email,username,role,mobileno} = decoded;
            console.log("decoded"+decoded);
            req.body = {email,username,role,mobileno};
            next();
        }catch(error){
            next(new CustomAPIError(error,401))
        }
    }
}
module.exports = authMiddleware;