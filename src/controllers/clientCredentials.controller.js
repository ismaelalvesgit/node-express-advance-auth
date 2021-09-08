import { clientCredentialsService } from "../services";
import { NotFound, BadRequest } from "../utils/erro";
import catchAsync from "../utils/catchAsync";
import { StatusCodes } from "http-status-codes";

export const findOne = catchAsync(async (req, res) =>{
    const where = {id: req.params.id};
    const [ data ] = await clientCredentialsService.findAllClientCredentials(where);
    if(!data){
        throw new NotFound({code: "User"});
    }
    res.json(data);
});

export const find = catchAsync(async (req, res) =>{
    const where = req.query;
    const data = await clientCredentialsService.findAllClientCredentials(where);
    res.json(data);
});

export const create = catchAsync((req, res, next) =>{
    const data = req.body;
    clientCredentialsService.createClientCredentials(data).then(async(result)=>{
        if(result){
            res.status(StatusCodes.CREATED).json({result: req.__("Credential.create")});
        }else{
            throw new BadRequest({code: "Credential"});
        }
    }).catch(next);
});

export const remove = catchAsync(async (req, res, next) =>{
    const data = req.body;
    clientCredentialsService.removeClientCredentials(data).then((result)=>{
        if(result != 1){
            throw new NotFound({code: "Credential"});
        }
        res.sendStatus(StatusCodes.NO_CONTENT);
    }).catch(next);
});
