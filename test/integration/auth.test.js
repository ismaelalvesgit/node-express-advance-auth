import request from "supertest";
import { StatusCodes } from "http-status-codes";
import { app } from "../../src/app";
import { Chance } from "chance";
import knex from "../../src/db";
import { login, resetPassRash } from '../utils'

const chance = new  Chance();
describe("Auth Router", () => {
    
    beforeEach(async()=>{
        await Promise.all([
            knex("user").del()
        ]);
    });
    
    describe("sucess", ()=>{
        it("login", async() => {
            const email = chance.email()
            await login({email})
            const res = await request(app)
            .post(`/auth/login`)
            .send({
                email,
                password: '123456'
            })
            .expect(StatusCodes.OK);
            expect(res.body).toHaveProperty("token");
            expect(res.body).toHaveProperty("user");
        });
        
        it("resetPassword", async() => {
            const email = chance.email()
            await login({email})
            const res = await request(app)
            .post(`/auth/resetPassword`)
            .send({
                email,
            })
            .expect(StatusCodes.OK);
            expect(res.body).toBeDefined();
        });
        
        it("/changePassword - GET", async() => {
            const email = chance.email()
            const { rash } = await resetPassRash({email})
            await request(app)
            .get(`/auth/changePassword/${rash}`)
            .expect(StatusCodes.OK);
        });
        
        it("/changePassword - POST", async() => {
            const email = chance.email()
            const { rash } = await resetPassRash({email})
            await request(app)
            .post(`/auth/changePassword/${rash}`)
            .send({
                password: '123456'
            })
            .expect(StatusCodes.OK);
        });
    });
    
    describe("erro", ()=>{
        it("login - not required data", async() => {
            await request(app)
            .post(`/auth/login`)
            .send({
                password: '123456'
            })
            .expect(StatusCodes.BAD_REQUEST);
        });

        it("login - credentials fail", async() => {
            await request(app)
            .post(`/auth/login`)
            .send({
                email: chance.email(),
                password: '123456'
            })
            .expect(StatusCodes.UNAUTHORIZED);
        });
        
        it("resetPassword", async() => {
            const email = chance.email()
            const res = await request(app)
            .post(`/auth/resetPassword`)
            .send({
                email,
            })
            .expect(StatusCodes.NOT_FOUND);
            expect(res.body).toBeDefined();
        });
        
        it("/changePassword - GET", async() => {
            const rash = chance.string()
            await request(app)
            .get(`/auth/changePassword/${rash}`)
            .expect(StatusCodes.FORBIDDEN);
        });
        
        it("/changePassword - POST", async() => {
            const rash = chance.string()
            await request(app)
            .post(`/auth/changePassword/${rash}`)
            .send({
                password: '123456'
            })
            .expect(StatusCodes.FORBIDDEN);
        });
    });
    
});