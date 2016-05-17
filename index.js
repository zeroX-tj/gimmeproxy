var request = require('request-promise')
  , randomstring = require('randomstring')
;

var GimmeProxy = {
  '_userId': null,
  '_timeout': null,
  '_type': null,
  '_host': 'http://gimmeproxy.com',
  '_path': '/api/getProxy',
  '_timeout_path': '/api/get',
  'config': function(config) {
    if (config.userId) this._userId = config.userId;
    if (config.timeout) this._timeout = config.timeout;
    if (config.type) this._type = config.type;
    // if there is no user id get a random one so timeouts can still work
    if (! this._userId) {
      this._userId = randomstring.generate(32);
    }
  },
  'getProxy': function(timeout) {
    timeout = timeout || this._timeout || null;

    // we are gonna need a user id
    if (timeout) this.config({});

    var path = timeout ? (this._timeout_path + '/' + this._userId + '/?timeout=' + timeout) : this._path; // API gives 404 on timeouts
    var url = this._host + this._path;
    if(this._type) url += '?type='+this._type;

    return request(url).then(function(resp) {
      return JSON.parse(resp);
    });
  }
};

module.exports = GimmeProxy;