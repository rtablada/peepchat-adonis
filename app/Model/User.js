'use strict';

const Lucid = use('Lucid');

class User extends Lucid {

  apiTokens() {
    return this.hasMany('App/Model/Token');
  }

  rooms() {
    return this.hasMany('App/Model/Room');
  }

}

module.exports = User;
