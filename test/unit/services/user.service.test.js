import { Chance } from "chance";
import { findAllUser, createUser, delUser, updateUser } from "../../../src/services/user.service";
import * as userModel from '../../../src/model/user.model'
import * as scopeModel from '../../../src/model/scope.model'
import * as clientCredentialsModel from '../../../src/model/clientCredentials.model'

jest.mock('../../../src/model/user.model')
jest.mock('../../../src/model/scope.model')
jest.mock('../../../src/model/clientCredentials.model')

const chance = new  Chance();
const id = chance.string({numeric: true, length: 1});
describe("User Service", () => {

    describe("sucess", ()=>{
        it("findAllUser", async() => {
            userModel.findAllUser.mockResolvedValue([
                {
                    id,
                    name: chance.name(),
                    email: chance.email()
                }
            ])
            await expect(findAllUser({id})).resolves.toBeDefined();
        });
        
        it("createUser", async() => {
            userModel.createUser.mockReturnThis();
            userModel.findAllUser.mockResolvedValue([
                {
                    id,
                    name: chance.name(),
                    email: chance.email()
                }
            ]);
            scopeModel.findAllScope.mockResolvedValue([
                {
                    id
                }
            ]);
            clientCredentialsModel.createClientCredentials.mockReturnThis();
            const user = await createUser({
                name: chance.name(),
                email: chance.email(),
                password: chance.string({numeric: true, length: 13})
            });
            expect(user).toBeDefined();
        });
        
        it("updateUser", async() => {
            userModel.updateUser.mockResolvedValue([1]);
            await expect(updateUser({id}, {name: chance.name()})).resolves.toBeDefined();
        });
        
        it("delUser", async() => {
            userModel.delUser.mockResolvedValue([1]);
            await expect(delUser({id})).resolves.toBeDefined();
        });
    });
    
    describe("error", ()=>{
        it("createUser - not required data", async() => {
            userModel.createUser.mockRejectedValue(new Error());
            await expect(createUser({
                name: chance.name(),
            })).rejects.toThrow();
        });
        
        it("updateUser - ID not exist", async() => {
            userModel.updateUser.mockResolvedValue(0);
            await expect(updateUser({id: chance.integer()}, {name: chance.name()})).resolves.toBe(0);
        });
        
        it("delUser - ID not exist", async() => {
            userModel.delUser.mockResolvedValue(0);
            await expect(delUser({id: chance.integer()})).resolves.toBe(0);
        });
    });

});