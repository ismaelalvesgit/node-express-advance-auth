import { scopeService } from "../services";
import { NotFound, BadRequest } from "../utils/erro";
import catchAsync from "../utils/catchAsync";
import { StatusCodes } from "http-status-codes";
import statusType from "../enum/statusType";

export const findOne = catchAsync(async (req, res) =>{
    const where = {id: req.params.id};
    const [ data ] = await scopeService.findAllScope(where);
    if(!data){
        throw new NotFound({code: "Scope"});
    }
    res.json(data);
});

export const find = catchAsync(async (req, res) =>{
    const where = req.query;
    const data = await scopeService.findAllScope(where);
    res.json(data);
});

export const create = catchAsync((req, res, next) =>{
    const data = req.body;
    scopeService.createScope(data).then(async(result)=>{
        if(result){
            res.status(StatusCodes.CREATED).json({result: req.__("Scope.create")});
        }else{
            throw new BadRequest({code: "Scope"});
        }
    }).catch(next);
});

export const update = catchAsync((req, res, next) =>{
    const data = req.body;
    const id = req.params.id;
    if(Object.keys(data).length){
        scopeService.updateScope({id}, data).then((result)=>{
            if(result != 1){
                throw new NotFound({code: "Scope"});
            }
            res.status(StatusCodes.OK).json({result: req.__("Scope.update")});
        }).catch(next);
    }else{
        res.status(StatusCodes.OK).json({result: req.__("Scope.update")});
    }
});

export const active = catchAsync(async (req, res, next) =>{
    const id = req.params.id;
    scopeService.updateScope({id}, {status: statusType.ACTIVE}).then((result)=>{
        if(result != 1){
            throw new NotFound({code: "Scope"});
        }
        res.status(StatusCodes.OK).json({result: req.__("Scope.active")});
    }).catch(next);
});

export const disabled = catchAsync(async (req, res, next) =>{
    const id = req.params.id;
    scopeService.updateScope({id}, {status: statusType.INACTIVE}).then((result)=>{
        if(result != 1){
            throw new NotFound({code: "Scope"});
        }
        res.status(StatusCodes.OK).json({result: req.__("Scope.disabled")});
    }).catch(next);
});

export const addRole = catchAsync(async (req, res, next) =>{
    const data = req.body;
    data["scopeId"] = req.params.id;
    scopeService.addRoleScope(data).then((result)=>{
        if(result){
            res.status(StatusCodes.CREATED).json({result: req.__("Scope.add.role")});
        }else{
            throw new BadRequest({message: "Fail to add role in Scope"});
        }
    }).catch(next);
});

export const removeRole = catchAsync(async (req, res, next) =>{
    const data = req.body;
    data["scopeId"] = req.params.id;
    scopeService.removeRoleScope(data).then((result)=>{
        if(result != 1){
            throw new NotFound({message: "Link not found"});
        }
        res.sendStatus(StatusCodes.NO_CONTENT);
    }).catch(next);
});
