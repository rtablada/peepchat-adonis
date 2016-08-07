'use strict';

const Room = use('App/Model/Room');

class RoomController {

  * index(request, response) {
    const rooms = yield Room.with('user').fetch();

    response.jsonApi('Room', rooms);
  }

  * store(request, response) {
    const owner = request.authUser;
    const roomParams = request.jsonApi.getAttributesCamelCase(['name']);

    const room = yield Room.create(Object.assign({}, roomParams, { owner_id: owner.id }));
    response.jsonApi('Room', room);
  }

  * show(request, response) {
    const id = request.param('id');

    const room = yield Room.findOrFail(id);
    response.jsonApi('Room', room);
  }

  * update(request, response) {
    const { id: owner_id } = request.authUser;
    const roomParams = request.jsonApi.getAttributesCamelCase(['name']);
    const id = request.param('id');
    request.jsonApi.assertId(id);

    const room = yield Room.query().where({ id, owner_id }).firstOrFail();
    yield room.update(roomParams);

    response.jsonApi('Room', room);
  }

  * destroy(request, response) {
    const { id: owner_id } = request.authUser;
    const id = request.param('id');

    const room = yield Room.query().where({ id, owner_id }).firstOrFail();
    yield room.delete();

    response.status(204).send();
  }

}

module.exports = RoomController;
