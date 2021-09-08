import { userService } from "../services";
import { NotFound, BadRequest } from "../utils/erro";
import catchAsync from "../utils/catchAsync";
import { StatusCodes } from "http-status-codes";
import { welcome } from "../utils/mail";
import logger from "../logger";

export const findOne = catchAsync(async (req, res) =>{
    const where =  req.user ? { email: req.user.email } : {id: req.params.id};
    const [ data ] = await userService.findAllUser(where);
    if(!data){
        throw new NotFound({code: "User"});
    }
    res.json(data);
});

export const find = catchAsync(async (req, res) =>{
    const where = req.user ? { email: req.user.email } : req.query;
    const data = await userService.findAllUser(where);
    if(req.user && !data[0]){
        throw new NotFound({code: "User"});
    }
    res.json(req.user ? data[0] : data);
});

export const create = catchAsync((req, res, next) =>{
    const data = req.body;
    userService.createUser(data).then(async(user)=>{
        if(user){
            try {
                welcome(user).then();
            } catch (error) {
                logger.error(`Fail to send email - ${error}`);
            }
            res.status(StatusCodes.CREATED).json({result: req.__("User.create")});
        }else{
            throw new BadRequest({code: "User"});
        }
    }).catch(next);
});


export const update = catchAsync((req, res, next) =>{
    const data = req.body;
    const where =  req.user ? { email: req.user.email } : {id: req.params.id};
    if(Object.keys(data).length){
        userService.updateUser(where, data).then((result)=>{
            if(result != 1){
                throw new NotFound({code: "User"});
            }
            res.status(StatusCodes.OK).json({result: req.__("User.update")});
        }).catch(next);
    }else{
        res.status(StatusCodes.OK).json({result: req.__("User.update")});
    }
});

export const del = catchAsync(async (req, res, next) =>{
    const where =  req.user ? { email: req.user.email } : {id: req.params.id};
    userService.delUser(where).then((result)=>{
        if(result != 1){
            throw new NotFound({code: "User"});
        }
        res.sendStatus(StatusCodes.NO_CONTENT);
    }).catch(next);
});