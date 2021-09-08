import request from "supertest";
import { StatusCodes } from "http-status-codes";
import { app } from "../../src/app";
import { Chance } from "chance";
import knex from "../../src/db";
import { tokenAdmin } from '../utils'

const chance = new  Chance();
const tokenAdm = tokenAdmin();
const httpMethod = [
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
    "COPY",
    "HEAD",
    "OPTIONS",
    "LINK",
    "UNLINK",
    "PURGE",
    "LOCK",
    "UNLOCK",
    "PROPFIND",
    "VIEW",
]

describe("Role Router", () => {
    
    beforeEach(async()=>{
        await Promise.all([
            knex("role").del()
        ]);
    });

    describe("sucess", ()=>{
        it("findOne", async() => {
            const role = await knex("role").insert({
                name: chance.name(),
                description: chance.string(),
                route: chance.url(),
                httpMethod: chance.pickone(httpMethod)
            });

            const res = await request(app)
            .get(`/role/${role[0]}`)
            .set('Authorization', tokenAdm)
            .expect(StatusCodes.OK);
            expect(res.body).toHaveProperty("name");
            expect(res.body).toHaveProperty("description");
        });
        
        it("find", async() => {
            await knex("role").insert({
                name: chance.name(),
                description: chance.string(),
                route: chance.url(),
                httpMethod: chance.pickone(httpMethod)
            });

            const res = await request(app)
            .get("/role")
            .set('Authorization', tokenAdm)
            .expect(StatusCodes.OK);
            expect(res.body[0]).toHaveProperty("name");
            expect(res.body[0]).toHaveProperty("description");
        });
        
        it("create", async() => {
            const res = await request(app)
            .post("/role")
            .set('Authorization', tokenAdm)
            .send({
                name: chance.name(),
                description: chance.string(),
                route: chance.url(),
                httpMethod: chance.pickone(httpMethod)
            })
            .expect(StatusCodes.CREATED);
            expect(res.body).toBeDefined();
        });
       
        it("update", async() => {
            const [ id ] = await knex("role").insert({
                name: chance.name(),
                description: chance.string(),
                route: chance.url(),
                httpMethod: chance.pickone(httpMethod)
            });
            const res = await request(app)
            .put(`/role/${id}`)
            .set('Authorization', tokenAdm)
            .send({
                name: chance.name(),
            })
            .expect(StatusCodes.OK);
            expect(res.body).toBeDefined();
        });
        
        it("disabled", async() => {
            const [ id ] = await knex("role").insert({
                name: chance.name(),
                description: chance.string(),
                route: chance.url(),
                httpMethod: chance.pickone(httpMethod)
            });
            const res = await request(app)
            .put(`/role/disabled/${id}`)
            .set('Authorization', tokenAdm)
            .expect(StatusCodes.OK);
            expect(res.body).toBeDefined();
        });
        
        it("active", async() => {
            const [ id ] = await knex("role").insert({
                name: chance.name(),
                description: chance.string(),
                route: chance.url(),
                httpMethod: chance.pickone(httpMethod)
            });
            const res = await request(app)
            .put(`/role/active/${id}`)
            .set('Authorization', tokenAdm)
            .expect(StatusCodes.OK);
            expect(res.body).toBeDefined();
        });
    });
    
    describe("erro", ()=>{
        it("findOne", async() => {
            await request(app)
            .get(`/role/${chance.integer()}`)
            .set('Authorization', tokenAdm)
            .expect(StatusCodes.NOT_FOUND);
        });
        
        it("create", async() => {
            const res = await request(app)
            .post("/role")
            .set('Authorization', tokenAdm)
            .send({
                name: chance.name(),
            })
            .expect(StatusCodes.BAD_REQUEST);
            expect(res.body).toBeDefined();
        });
       
        it("update", async() => {
            await request(app)
            .put(`/role/${chance.integer()}`)
            .set('Authorization', tokenAdm)
            .send({
                name: chance.name(),
            })
            .expect(StatusCodes.NOT_FOUND);
        });
        
        it("disabled", async() => {
            await request(app)
            .put(`/role/disabled/${chance.integer()}`)
            .set('Authorization', tokenAdm)
            .expect(StatusCodes.NOT_FOUND);
        });
        
        it("active", async() => {
            await request(app)
            .put(`/role/active/${chance.integer()}`)
            .set('Authorization', tokenAdm)
            .expect(StatusCodes.NOT_FOUND);
        });
    });
    
});