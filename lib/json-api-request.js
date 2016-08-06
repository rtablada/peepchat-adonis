const NE = require('node-exceptions');

class JsonApiError extends NE.LogicalException {}

const pick = require('lodash.pick');

class JsonApiRequest {
  /**
   * Setups the JsonApiRequest object
   * @param  Adonis/Request request
   * @return void
   */
  constructor(request) {
    this.request = request;
  }

  getAttributes(picker) {
    const { data: { attributes } } = this.request.all() || {};

    if (picker) {
      return pick(attributes, picker);
    }

    return attributes;
  }

  getId() {
    try {
      const { data: { id } } = this.request.all() || {};

      return id;
    } catch (e) {
      throw new JsonApiError({
        code: '400',
        title: 'Invalid data root',
        detail: 'Missing `data` Member at document\'s top level.',
      }, 400);
    }
  }

  assertId(testId) {
    const id = this.getId();

    if (id !== testId) {
      throw new JsonApiError({
        code: '400',
        title: 'Id mismatch',
        description: 'Id for request body does not match id in URL',
      }, 400);
    }
  }
}

module.exports = {
  JsonApiRequest,
  JsonApiError,
};
