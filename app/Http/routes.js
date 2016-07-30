'use strict';

/*
|--------------------------------------------------------------------------
| Router
|--------------------------------------------------------------------------
|
| AdonisJs Router helps you in defining urls and their actions. It supports
| all major HTTP conventions to keep your routes file descriptive and
| clean.
|
| @example
| Route.get('/user', 'UserController.index')
| Route.post('/user', 'UserController.store')
| Route.resource('user', 'UserController')
*/

const Route = use('Route');

Route.on('/').render('welcome');

const User = use('App/Model/User');
const Hash = use('Hash');

Route.group('api', () => {
  Route.post('/register', function * (request, response) {
    const {
      data: {
        attributes: { email, password },
      },
    } = request.all();

    const user = yield User.create({ email, password: Hash.make(password) });

    response.jsonApi('User', user, 201);
  });
}).prefix('/api');
