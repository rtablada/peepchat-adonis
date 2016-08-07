'use strict';

const Lucid = use('Lucid');

class Room extends Lucid {
  owner() {
    return this.belongsTo('App/Model/User');
  }
}

module.exports = Room;
