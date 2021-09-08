require("@babel/register");
const env = require('./src/env');

module.exports = {
    local:{
        client: 'mysql2',
        connection: {
            host: env.default.db.host,
            port: env.default.db.port,
            user: env.default.db.user,
            password: env.default.db.password,
            database: env.default.db.database,
            supportBigNumbers: true,
            bigNumberStrings: true,
            multipleStatements: true,
            dateStrings: true
        },
        migrations: {
            tableName: 'migrations',
            directory: `${__dirname}/db/migrations`
        },
        seeds: {
            tableName: 'seeds',
            directory: `${__dirname}/db/seeds`
        },
        pool:{
            min: 2,
            max: 10,
            afterCreate: function(conn, cb) {
              conn.query('SET sql_mode="NO_ENGINE_SUBSTITUTION";', function (err) {
                cb(err, conn);
              });
            }
        },
        debug: env.default.db.debug
    },
    test:{
        client: 'mysql2',
        connection: {
            host: env.default.db.host,
            port: env.default.db.port,
            user: env.default.db.user,
            password: env.default.db.password,
            database: env.default.db.databaseTest,
            supportBigNumbers: true,
            bigNumberStrings: true,
            multipleStatements: true,
            dateStrings: true
        },
        migrations: {
            tableName: 'migrations',
            directory: `${__dirname}/db/migrations`
        },
        seeds: {
            tableName: 'seeds',
            directory: `${__dirname}/db/seeds`
        },
        pool:{
            min: 2,
            max: 10,
            afterCreate: function(conn, cb) {
              conn.query('SET sql_mode="NO_ENGINE_SUBSTITUTION";', function (err) {
                cb(err, conn);
              });
            }
        },
    }
};