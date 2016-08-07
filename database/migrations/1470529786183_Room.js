'use strict';

const Schema = use('Schema');

class RoomSchema extends Schema {

  up() {
    this.create('rooms', (table) => {
      table.increments();

      table.string('name').unique();
      table.integer('owner_id')
        .references('users.id')
        .onDelete('CASCADE');

      table.timestamps();
    });
  }

  down() {
    this.drop('rooms');
  }

}

module.exports = RoomSchema;
