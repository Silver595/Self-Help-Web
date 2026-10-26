import mongoose from 'mongoose';
import { ApiError } from '../utils/ApiError.js';

export const validateObjectId = (paramName) => (req,res,next)=>{
    if(!mongoose.Types.ObjectId.isValid(req.params[paramName])){
        return next(new ApiError(400, `Invalid ${paramName}`));
    }
    next();
}