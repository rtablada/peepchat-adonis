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

    const user = yield User.create({ email, password: yield Hash.make(password) });

    response.jsonApi('User', user, 201);
  });

  Route.post('/token', function * (request, response) {
    const { grant_type: grantType, username: email, password } = request.all();

    if (grantType !== 'password') {
      return response.status(400).json({
        status: 400,

        errors: [{ detail: 'Unsupported grant_type' }],
      });
    }

    try {
      const user = yield User.findBy('email', email);

      yield Hash.verify(password, user.password);
      const jwt = yield request.auth.generate(user);

      return response.json({ access_token: jwt });
    } catch (e) {
      return response.status(401).json({
        status: 401,

        errors: [{ detail: 'User failed to login' }],
      });
    }
  });

  Route.get('/test', function * (request, response) {
    request.jsonApi.assertId(1);
    response.send('foo');
  });

  Route.get('/user/current', function * (request, response) {
    const user = request.authUser;

    response.jsonApi('User', user);
  }).middleware('auth');
}).prefix('/api');
