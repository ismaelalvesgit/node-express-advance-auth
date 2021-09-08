import { roleService } from "../services";
import { NotFound, BadRequest } from "../utils/erro";
import catchAsync from "../utils/catchAsync";
import { StatusCodes } from "http-status-codes";
import statusType from "../enum/statusType";

export const findOne = catchAsync(async (req, res) =>{
    const where = {id: req.params.id};
    const [ data ] = await roleService.findAllRole(where);
    if(!data){
        throw new NotFound({code: "Role"});
    }
    res.json(data);
});

export const find = catchAsync(async (req, res) =>{
    const where = req.query;
    const data = await roleService.findAllRole(where);
    res.json(data);
});

export const create = catchAsync((req, res, next) =>{
    const data = req.body;
    roleService.createRole(data).then(async(result)=>{
        if(result){
            res.status(StatusCodes.CREATED).json({result: req.__("Role.create")});
        }else{
            throw new BadRequest({code: "Role"});
        }
    }).catch(next);
});

export const update = catchAsync((req, res, next) =>{
    const data = req.body;
    const id = req.params.id;
    if(Object.keys(data).length){
        roleService.updateRole({id}, data).then((result)=>{
            if(result != 1){
                throw new NotFound({code: "Role"});
            }
            res.status(StatusCodes.OK).json({result: req.__("Role.update")});
        }).catch(next);
    }else{
        res.status(StatusCodes.OK).json({result: req.__("Role.update")});
    }
});

export const active = catchAsync(async (req, res, next) =>{
    const id = req.params.id;
    roleService.updateRole({id}, {status: statusType.ACTIVE}).then((result)=>{
        if(result != 1){
            throw new NotFound({code: "Role"});
        }
        res.status(StatusCodes.OK).json({result: req.__("Role.active")});
    }).catch(next);
});

export const disabled = catchAsync(async (req, res, next) =>{
    const id = req.params.id;
    roleService.updateRole({id}, {status: statusType.INACTIVE}).then((result)=>{
        if(result != 1){
            throw new NotFound({code: "Role"});
        }
        res.status(StatusCodes.OK).json({result: req.__("Role.disabled")});
    }).catch(next);
});