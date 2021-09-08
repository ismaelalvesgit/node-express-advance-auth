import request from "supertest";
import { StatusCodes } from "http-status-codes";
import { app } from "../../src/app";
import { Chance } from "chance";
import knex from "../../src/db";
import { tokenAdmin, login } from '../utils'
import sourceType from "../../src/enum/sourceType";

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

describe("Credentials Router", () => {
    
    beforeEach(async()=>{
        await Promise.all([
            knex("user").del(),
            knex("role").del(),
            knex("scope").del(),
            knex("clientCredentials").del()
        ]);
    });

    describe("sucess", ()=>{
        it("findOne", async() => {
            const email = chance.email()
            const { user } = await login({email})
            const role = await knex("role").insert({
                name: chance.name(),
                description: chance.string(),
                route: chance.url(),
                httpMethod: chance.pickone(httpMethod)
            });
            await knex("clientCredentials").insert({
                userId: user.id,
                reference: role[0],
                source: sourceType.ROLE,
            });

            const res = await request(app)
            .get(`/credentials/${user.id}`)
            .set('Authorization', tokenAdm)
            .expect(StatusCodes.OK);
            expect(res.body).toHaveProperty("name");
            expect(res.body).toHaveProperty("email");
        });
        
        it("find", async() => {
            const email = chance.email()
            const { user } = await login({email})
            const role = await knex("role").insert({
                name: chance.name(),
                description: chance.string(),
                route: chance.url(),
                httpMethod: chance.pickone(httpMethod)
            });
            await knex("clientCredentials").insert({
                userId: user.id,
                reference: role[0],
                source: sourceType.ROLE,
            });

            const res = await request(app)
            .get("/credentials")
            .set('Authorization', tokenAdm)
            .expect(StatusCodes.OK);
            expect(res.body[0]).toHaveProperty("name");
            expect(res.body[0]).toHaveProperty("email");
        });
        
        it("create", async() => {
            const email = chance.email()
            const { user } = await login({email})
            const role = await knex("role").insert({
                name: chance.name(),
                description: chance.string(),
                route: chance.url(),
                httpMethod: chance.pickone(httpMethod)
            });

            const res = await request(app)
            .post("/credentials")
            .set('Authorization', tokenAdm)
            .send({
                userId: user.id,
                reference: role[0],
                source: sourceType.ROLE,
            })
            .expect(StatusCodes.CREATED);
            expect(res.body).toBeDefined();
        });
       
        it("remove", async() => {
            const email = chance.email()
            const { user } = await login({email})
            const role = await knex("role").insert({
                name: chance.name(),
                description: chance.string(),
                route: chance.url(),
                httpMethod: chance.pickone(httpMethod)
            });
            await knex("clientCredentials").insert({
                userId: user.id,
                reference: role[0],
                source: sourceType.ROLE,
            });

            const res = await request(app)
            .del(`/credentials`)
            .set('Authorization', tokenAdm)
            .send({
                userId: user.id,
                reference: role[0],
                source: sourceType.ROLE,
            })
            .expect(StatusCodes.NO_CONTENT);
            expect(res.body).toBeDefined();
        });
        
    });
    
    describe("erro", ()=>{
        it("findOne", async() => {
            const res = await request(app)
            .get(`/credentials/${chance.integer()}`)
            .set('Authorization', tokenAdm)
            .expect(StatusCodes.NOT_FOUND);
            expect(res.body).toBeDefined();
        });
        
        it("create - user not exist", async() => {
            const role = await knex("role").insert({
                name: chance.name(),
                description: chance.string(),
                route: chance.url(),
                httpMethod: chance.pickone(httpMethod)
            });

            const res = await request(app)
            .post("/credentials")
            .set('Authorization', tokenAdm)
            .send({
                userId: chance.integer(),
                reference: role[0],
                source: sourceType.ROLE,
            })
            .expect(StatusCodes.NOT_FOUND);
            
            expect(res.body).toBeDefined();
        });
        
        it("create - role not exist", async() => {
            const { user } = await login({email: chance.email()})
            const res = await request(app)
            .post("/credentials")
            .set('Authorization', tokenAdm)
            .send({
                userId: user.id,
                reference: chance.integer(),
                source: sourceType.ROLE,
            })
            .expect(StatusCodes.NOT_FOUND);
            
            expect(res.body).toBeDefined();
        });
       
        it("create - scope not exist", async() => {
            const { user } = await login({email: chance.email()})
            const res = await request(app)
            .post("/credentials")
            .set('Authorization', tokenAdm)
            .send({
                userId: user.id,
                reference: chance.integer(),
                source: sourceType.SCOPE,
            })
            .expect(StatusCodes.NOT_FOUND);
            
            expect(res.body).toBeDefined();
        });
        
        it("create - not required data", async() => {
            const res = await request(app)
            .post("/credentials")
            .set('Authorization', tokenAdm)
            .expect(StatusCodes.BAD_REQUEST);
            expect(res.body).toBeDefined();
        });
       
        it("remove - match not exist", async() => {
            const res = await request(app)
            .del(`/credentials`)
            .set('Authorization', tokenAdm)
            .send({
                userId: chance.integer(),
                reference: chance.integer(),
                source: sourceType.ROLE,
            })
            .expect(StatusCodes.NOT_FOUND);
            expect(res.body).toBeDefined();
        });
        
        it("remove - not required data", async() => {
            const res = await request(app)
            .del(`/credentials`)
            .set('Authorization', tokenAdm)
            .expect(StatusCodes.BAD_REQUEST);
            expect(res.body).toBeDefined();
        });
    });
    
});