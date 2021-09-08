import knex from 'knex'
import knexFile from './knexfile'
import env from './src/env'
const conn = knex(knexFile.test)
import { executeSql } from './test/utils'

jest.mock('./src/utils/mail.js')

beforeAll(async()=>{
    try {
        await executeSql(`CREATE DATABASE IF NOT EXISTS ${env.db.databaseTest}`)
    } catch (error) {console.log(error)}
    await conn.migrate.up()
    await conn.seed.run()
})

afterAll(async ()=>{
    try {
        await executeSql(`DROP DATABASE IF EXISTS ${env.db.databaseTest}`)
    } catch (error) {console.log(error)}
})

