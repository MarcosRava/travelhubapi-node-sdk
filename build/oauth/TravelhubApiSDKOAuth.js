'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _simpleOauth = require('simple-oauth2');

var _simpleOauth2 = _interopRequireDefault(_simpleOauth);

var _requestPromise = require('request-promise');

var _requestPromise2 = _interopRequireDefault(_requestPromise);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _TravelHubApiSDKException = require('../common/TravelHubApiSDKException');

var _TravelHubApiSDKException2 = _interopRequireDefault(_TravelHubApiSDKException);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TravelhubApiSDKOAuth = function () {
  _createClass(TravelhubApiSDKOAuth, null, [{
    key: 'homologHost',
    get: function get() {
      return 'http://auth.stg.travelhubapi.com.br';
    }
  }, {
    key: 'productionHost',
    get: function get() {
      return 'http://auth.travelhubapi.com.br';
    }
  }]);

  function TravelhubApiSDKOAuth(settings) {
    _classCallCheck(this, TravelhubApiSDKOAuth);

    this.host = settings.enviroment === 'production' ? TravelhubApiSDKOAuth.productionHost : TravelhubApiSDKOAuth.homologHost;
    var credentials = {
      client: {
        id: settings.clientId,
        secret: settings.clientSecret
      },
      auth: {
        tokenHost: this.host,
        authorizePath: '/oauth2',
        tokenPath: '/oauth2/token'
      }
    };
    this.oauth = _simpleOauth2.default.create(credentials);
    this.accessToken = settings.token;
    this.language = settings.language || 'pt-BR';
  }

  _createClass(TravelhubApiSDKOAuth, [{
    key: 'request',
    value: function request() {
      var _this = this;

      var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      return this.getToken().then(function (token) {
        var options = {
          auth: {
            bearer: token.access_token
          },
          headers: {
            'Accept-Language': _this.language
          },
          resolveWithFullResponse: true,
          json: true
        };

        Object.assign(options, opts);

        return (0, _requestPromise2.default)(options);
      }).catch(function (e) {
        if (e && e.statusCode > 399 && e.response && e.response.body) {
          throw new _TravelHubApiSDKException2.default(e.response);
        }
        throw e;
      });
    }
  }, {
    key: 'getToken',
    value: function getToken() {
      var parameters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      if (!this.accessToken || parameters.forceCreate) {
        return this.createToken();
      }

      if (this.accessToken.expired()) {
        return this.refreshToken();
      }

      return _bluebird2.default.resolve(this.accessToken.token);
    }
  }, {
    key: 'createToken',
    value: function createToken() {
      var _this2 = this;

      return this.oauth.clientCredentials.getToken().then(function (result) {
        _this2.accessToken = _this2.oauth.accessToken.create(result);
        return _this2.accessToken.token;
      });
    }
  }, {
    key: 'refreshToken',
    value: function refreshToken() {
      var _this3 = this;

      return this.accessToken.refresh().then(function (accessToken) {
        _this3.accessToken = accessToken;
        return _this3.accessToken.token;
      });
    }
  }]);

  return TravelhubApiSDKOAuth;
}();

exports.default = TravelhubApiSDKOAuth;
module.exports = exports['default'];