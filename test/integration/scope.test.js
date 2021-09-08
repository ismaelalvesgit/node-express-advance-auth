import request from "supertest";
import { StatusCodes } from "http-status-codes";
import { app } from "../../src/app";
import { Chance } from "chance";
import knex from "../../src/db";
import { tokenAdmin } from '../utils'

const chance = new  Chance();
const tokenAdm = tokenAdmin();

describe("Scope Router", () => {
    
    beforeEach(async()=>{
        await Promise.all([
            knex("role").del(),
            knex("scope").del()
        ]);
    });

    describe("sucess", ()=>{
        it("findOne", async() => {
            const scope = await knex("scope").insert({
                name: chance.name(),
                description: chance.string()
            });
            const res = await request(app)
            .get(`/scope/${scope[0]}`)
            .set('Authorization', tokenAdm)
            .expect(StatusCodes.OK);
            expect(res.body).toHaveProperty("name");
            expect(res.body).toHaveProperty("description");
        });
        
        it("find", async() => {
            await knex("scope").insert({
                name: chance.name(),
                description: chance.string()
            });

            const res = await request(app)
            .get("/scope")
            .set('Authorization', tokenAdm)
            .expect(StatusCodes.OK);
            expect(res.body[0]).toHaveProperty("name");
            expect(res.body[0]).toHaveProperty("description");
        });
        
        it("create", async() => {
            const res = await request(app)
            .post("/scope")
            .set('Authorization', tokenAdm)
            .send({
                name: chance.name(),
                description: chance.string()
            })
            .expect(StatusCodes.CREATED);
            expect(res.body).toBeDefined();
        });
       
        it("update", async() => {
            const [ id ] = await knex("scope").insert({
                name: chance.name(),
                description: chance.string()
            });
            const res = await request(app)
            .put(`/scope/${id}`)
            .set('Authorization', tokenAdm)
            .send({
                name: chance.name(),
            })
            .expect(StatusCodes.OK);
            expect(res.body).toBeDefined();
        });
        
        it("disabled", async() => {
            const [ id ] = await knex("scope").insert({
                name: chance.name(),
                description: chance.string()
            });
            const res = await request(app)
            .put(`/scope/disabled/${id}`)
            .set('Authorization', tokenAdm)
            .expect(StatusCodes.OK);
            expect(res.body).toBeDefined();
        });
        
        it("active", async() => {
            const [ id ] = await knex("scope").insert({
                name: chance.name(),
                description: chance.string()
            });
            const res = await request(app)
            .put(`/scope/active/${id}`)
            .set('Authorization', tokenAdm)
            .expect(StatusCodes.OK);
            expect(res.body).toBeDefined();
        });
        
        it("addRole", async() => {
            const ids = await knex.transaction(async(trx)=>{
                const [ scope ] = await knex("scope").insert({
                    name: chance.name(),
                    description: chance.string()
                }).transacting(trx);
               
                const [ role ] = await knex("role").insert({
                    name: chance.name(),
                    description: chance.string(),
                    route: chance.url(),
                    httpMethod: 'POST'
                }).transacting(trx);
                return { scope, role}
            });

            const res = await request(app)
            .post(`/scope/role/${ids.scope}`)
            .set('Authorization', tokenAdm)
            .send({
                roleId: ids.role
            })
            .expect(StatusCodes.CREATED);
            expect(res.body).toBeDefined();
        });
        
        it("removeRole", async() => {
            const ids = await knex.transaction(async(trx)=>{
                const [ scope ] = await knex("scope").insert({
                    name: chance.name(),
                    description: chance.string()
                }).transacting(trx);
               
                const [ role ] = await knex("role").insert({
                    name: chance.name(),
                    description: chance.string(),
                    route: chance.url(),
                    httpMethod: 'POST'
                }).transacting(trx);
                return { scope, role}
            });
            await request(app)
            .post(`/scope/role/${ids.scope}`)
            .set('Authorization', tokenAdm)
            .send({
                roleId: ids.role
            })

            const res = await request(app)
            .del(`/scope/role/${ids.scope}`)
            .set('Authorization', tokenAdm)
            .send({
                roleId: ids.role
            })
            .expect(StatusCodes.NO_CONTENT);
            expect(res.body).toBeDefined();
        });
    });
    
    describe("erro", ()=>{
        it("findOne", async() => {
            await request(app)
            .get(`/scope/${chance.integer()}`)
            .set('Authorization', tokenAdm)
            .expect(StatusCodes.NOT_FOUND);
        });
        
        it("create", async() => {
            const res = await request(app)
            .post("/scope")
            .set('Authorization', tokenAdm)
            .expect(StatusCodes.BAD_REQUEST);
            expect(res.body).toBeDefined();
        });
       
        it("update", async() => {
            await request(app)
            .put(`/scope/${chance.integer()}`)
            .set('Authorization', tokenAdm)
            .send({
                name: chance.name(),
            })
            .expect(StatusCodes.NOT_FOUND);
        });
        
        it("disabled", async() => {
            await request(app)
            .put(`/scope/disabled/${chance.integer()}`)
            .set('Authorization', tokenAdm)
            .expect(StatusCodes.NOT_FOUND);
        });
        
        it("active", async() => {
            await request(app)
            .put(`/scope/active/${chance.integer()}`)
            .set('Authorization', tokenAdm)
            .expect(StatusCodes.NOT_FOUND);
        });

        it("addRole - not required data", async() => {
            const ids = await knex.transaction(async(trx)=>{
                const [ scope ] = await knex("scope").insert({
                    name: chance.name(),
                    description: chance.string()
                }).transacting(trx);
                return { scope }
            });

            const res = await request(app)
            .post(`/scope/role/${ids.scope}`)
            .set('Authorization', tokenAdm)
            .expect(StatusCodes.BAD_REQUEST);
            expect(res.body).toBeDefined();
        });
        
        it("removeRole - not required data", async() => {
            const ids = await knex.transaction(async(trx)=>{
                const [ scope ] = await knex("scope").insert({
                    name: chance.name(),
                    description: chance.string()
                }).transacting(trx);
                return { scope }
            });

            const res = await request(app)
            .del(`/scope/role/${ids.scope}`)
            .set('Authorization', tokenAdm)
            .expect(StatusCodes.BAD_REQUEST);
            expect(res.body).toBeDefined();
        });

        it("addRole - scope not exist", async() => {
            const [ roleId ] = await knex("role").insert({
                name: chance.name(),
                description: chance.string(),
                route: chance.url(),
                httpMethod: 'POST'
            });
            const res = await request(app)
            .post(`/scope/role/${chance.integer()}`)
            .set('Authorization', tokenAdm)
            .send({
                roleId
            })
            .expect(StatusCodes.BAD_REQUEST);
            expect(res.body).toBeDefined();
        });
        
        it("removeRole - scope not exist", async() => {
            const [ roleId ] = await knex("role").insert({
                name: chance.name(),
                description: chance.string(),
                route: chance.url(),
                httpMethod: 'POST'
            });

            const res = await request(app)
            .del(`/scope/role/${chance.integer()}`)
            .set('Authorization', tokenAdm)
            .send({
                roleId
            })
            .expect(StatusCodes.BAD_REQUEST);
            expect(res.body).toBeDefined();
        });
    });
    
});