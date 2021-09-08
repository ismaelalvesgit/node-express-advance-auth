import statusType from '../../src/enum/statusType';
import sourceType from '../../src/enum/sourceType';

const createdAt = (knex, table) => table.timestamp('createdAt', { precision: 3 })
  .notNullable()
  .defaultTo(knex.fn.now(3));

const updatedAt = (knex, table) => table.timestamp('updatedAt', { precision: 3 })
  .notNullable()
  .defaultTo(knex.raw('CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)'));

/**
* @param {import('knex').Knex} knex
*/
exports.up = async function(knex) {
    await knex.schema.createTable('user', (table)=>{
      table.bigIncrements('id').unsigned();
      table.string('name').notNullable();
      table.string('email').notNullable();
      table.text('password').notNullable();
      table.unique('email');
      createdAt(knex, table);
      updatedAt(knex, table);
    });

    await knex.schema.createTable('loginHistory', (table)=>{
      table.bigIncrements('id').unsigned();
      table.bigInteger('userId')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('user')
        .onUpdate('CASCADE') 
        .onDelete('CASCADE');
      table.string('ipAddress').notNullable();
      table.string('browser');
      table.string('version');
      table.string('os');
      table.string('platform');
      table.string('source');
      table.json('userAgent').notNullable();
      table.json('geoIp');
      createdAt(knex, table);
      updatedAt(knex, table);
    });

    await knex.schema.createTable('role', (table)=>{
      table.bigIncrements('id').unsigned();
      table.string('name').notNullable();
      table.string('description').notNullable();
      table.string('route').notNullable();
      table.string('httpMethod').notNullable();
      table.enum('status', Object.keys(statusType)).defaultTo(statusType.ACTIVE).notNullable();
      table.unique('name');
      createdAt(knex, table);
      updatedAt(knex, table);
    });

    await knex.schema.createTable('scope', (table)=>{
      table.bigIncrements('id').unsigned();
      table.string('name').notNullable();
      table.string('description').notNullable();
      table.enum('status', Object.keys(statusType)).defaultTo(statusType.ACTIVE).notNullable();
      table.unique('name');
      createdAt(knex, table);
      updatedAt(knex, table);
    });

    await knex.schema.createTable('roleScope', (table)=>{
      table.bigInteger('roleId')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('role')
        .onUpdate('CASCADE') 
        .onDelete('CASCADE');
      table.bigInteger('scopeId')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('scope')
        .onUpdate('CASCADE') 
        .onDelete('CASCADE');
      table.unique(['scopeId', 'roleId']);
      createdAt(knex, table);
      updatedAt(knex, table);
    });
    
    await knex.schema.createTable('clientCredentials', (table)=>{
      table.bigInteger('userId')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('user')
        .onUpdate('CASCADE') 
        .onDelete('CASCADE');
      table.bigInteger('reference').notNullable();
      table.enum('source', Object.keys(sourceType)).notNullable();
      table.unique(['reference', 'source', 'userId']);
      createdAt(knex, table);
      updatedAt(knex, table);
    });
};

/**
* @param {import('knex').Knex} knex
*/
exports.down = async function(knex) {
  await knex.schema.dropTable('roleScope');
  await knex.schema.dropTable('role');
  await knex.schema.dropTable('scope');
  await knex.schema.dropTable('clientCredentials');
  await knex.schema.dropTable('loginHistory');
  await knex.schema.dropTable('user');
};
