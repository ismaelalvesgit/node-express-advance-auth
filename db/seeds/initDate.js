import sourceType from '../../src/enum/sourceType';
import { encrypt } from '../../src/utils'

/**
* @param {import('knex').Knex} knex
*/
exports.seed = async function(knex) {
  return await knex.transaction(async (trx)=>{
    await knex('user').del().where({email: "admin@admin.com"})
    await knex('role').del().where({name: "user-edit"})
    await knex('role').del().where({name: "user-create"})
    await knex('role').del().where({name: "user-delete"})
    await knex('scope').del().where({name: "user-manager"})

    const password = await encrypt("123456")

    await knex('user').insert({
      name: "ismael",
      email: "admin@admin.com",
      password
    }).transacting(trx);

    await knex('role').insert({
      name: "user-find",
      description: "namespace: user",
      route: "/user",
      httpMethod: "GET"
    }).transacting(trx);

    await knex('role').insert({
      name: "user-edit",
      description: "namespace: user",
      route: "/user",
      httpMethod: "PUT"
    }).transacting(trx);
    
    await knex('role').insert({
      name: "user-create",
      description: "namespace: user",
      route: "/user",
      httpMethod: "POST"
    }).transacting(trx);
    
    await knex('role').insert({
      name: "user-delete",
      description: "namespace: user",
      route: "/user",
      httpMethod: "DELETE"
    }).transacting(trx);

    await knex('scope').insert({
      name: "user-manager",
      description: "Manager user´s",
    }).transacting(trx);

    const roles = await knex('role').select('id').whereIn('name', ["user-edit", "user-create", "user-delete", "user-find"]).transacting(trx);
    const scopeId = await knex('scope').select('id').first().where({name: "user-manager"}).transacting(trx);
    const userId = await knex('user').select('id').first().where({email: "admin@admin.com"}).transacting(trx);

    await knex('roleScope').insert([
      {
        roleId: roles[0].id,
        scopeId: scopeId.id
      },
      {
        roleId: roles[1].id,
        scopeId: scopeId.id
      },
      {
        roleId: roles[2].id,
        scopeId: scopeId.id
      }
    ]).transacting(trx);    

    await knex('clientCredentials').insert([
      {
        userId: userId.id,
        reference: roles[0].id,
        source: sourceType.ROLE,
      },
      {
        userId: userId.id,
        reference: scopeId.id,
        source: sourceType.SCOPE,
      }
    ]).transacting(trx);          
  });
};
