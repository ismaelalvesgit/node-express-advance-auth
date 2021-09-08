import request from "supertest";
import { StatusCodes } from "http-status-codes";
import { app } from "../../src/app";
import { Chance } from "chance";
import knex from "../../src/db";
import { tokenAdmin, login } from '../utils'

const chance = new  Chance();
const tokenAdm = tokenAdmin();
describe("User Router", () => {
    
    beforeEach(async()=>{
        await Promise.all([
            knex("user").del()
        ]);
    });

    describe("sucess admin", ()=>{
        it("findOne", async() => {
            const user = await knex("user").insert({
                name: chance.name(),
                email: chance.email(),
                password: chance.string({numeric: true, length: 6})
            });

            const res = await request(app)
            .get(`/user/${user[0]}`)
            .set('Authorization', tokenAdm)
            .expect(StatusCodes.OK);
            expect(res.body).toHaveProperty("name");
            expect(res.body).toHaveProperty("email");
        });
        
        it("find", async() => {
            await knex("user").insert({
                name: chance.name(),
                email: chance.email(),
                password: chance.string({numeric: true, length: 6})
            });

            const res = await request(app)
            .get("/user")
            .set('Authorization', tokenAdm)
            .expect(StatusCodes.OK);
            expect(res.body[0]).toHaveProperty("name");
            expect(res.body[0]).toHaveProperty("email");
        });
        
        it("create", async() => {
            const res = await request(app)
            .post("/user")
            .send({
                name: chance.name(),
                email: chance.email(),
                password: chance.string({numeric: true, length: 6})
            })
            .expect(StatusCodes.CREATED);
            expect(res.body).toBeDefined();
        });
       
        it("update", async() => {
            const [ id ] = await knex("user").insert({
                name: chance.name(),
                email: chance.email(),
                password: chance.string({numeric: true, length: 6})
            });
            const res = await request(app)
            .put(`/user/${id}`)
            .set('Authorization', tokenAdm)
            .send({
                name: chance.name(),
            })
            .expect(StatusCodes.OK);
            expect(res.body).toBeDefined();
        });
        
        it("delete", async() => {
            const [ id ] = await knex("user").insert({
                name: chance.name(),
                email: chance.email(),
                password: chance.string({numeric: true, length: 6})
            });
            await request(app)
            .del(`/user/${id}`)
            .set('Authorization', tokenAdm)
            .expect(StatusCodes.NO_CONTENT);
        });
    });
    
    describe("sucess users", ()=>{
        it("findOne", async() => {
            const email = chance.email()
            const { token } = await login({email})
            const res = await request(app)
            .get(`/user`)
            .set('Authorization', token)
            .expect(StatusCodes.OK);
            expect(res.body).toHaveProperty("name");
            expect(res.body).toHaveProperty("email");
        });
        
        it("update", async() => {
            const email = chance.email()
            const { token } = await login({email})
            const res = await request(app)
            .put(`/user`)
            .set('Authorization', token)
            .send({
                name: chance.name(),
            })
            .expect(StatusCodes.OK);
            expect(res.body).toBeDefined();
        });
        
        it("delete", async() => {
            const email = chance.email()
            const { token } = await login({email})
            await request(app)
            .del(`/user`)
            .set('Authorization', token)
            .expect(StatusCodes.NO_CONTENT);
        });
    });
    
    describe("erro", ()=>{
        it("findOne", async() => {
            await request(app)
            .get(`/user/${chance.integer()}`)
            .set('Authorization', tokenAdm)
            .expect(StatusCodes.NOT_FOUND);
        });
        
        it("create", async() => {
            const res = await request(app)
            .post("/user")
            .send({
                email: chance.email(),
            })
            .expect(StatusCodes.BAD_REQUEST);
            expect(res.body).toBeDefined();
        });
       
        it("update", async() => {
            await request(app)
            .put(`/user/${chance.integer()}`)
            .set('Authorization', tokenAdm)
            .send({
                name: chance.name(),
            })
            .expect(StatusCodes.NOT_FOUND);
        });
        
        it("delete", async() => {
            await request(app)
            .del(`/user/${chance.integer()}`)
            .set('Authorization', tokenAdm)
            .expect(StatusCodes.NOT_FOUND);
        });
    });
    
});