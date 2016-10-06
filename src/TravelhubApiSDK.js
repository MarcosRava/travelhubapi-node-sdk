import TravelhubApiSDKHotel from './TravelhubApiSDKHotel';
import TravelhubApiSDKOAuth from './TravelhubApiSDKOAuth';

export default class TravelhubApiSDK {

  constructor(settings) {
    const config = {
      version: 'v1',
    };
    Object.assign(config, settings);
    this.oauth = new TravelhubApiSDKOAuth(config);
    this.hotel = new TravelhubApiSDKHotel(config, this.oauth);
  }

  request(method, uri, options = {}) {
    const opts = {
      uri,
      method,
    };
    Object.assign(opts, options);
    return this.oauth.request(opts);
  }

  get(uri, options) {
    return this.request('GET', uri, options);
  }

  post(uri, options) {
    return this.request('POST', uri, options);
  }

  del(uri, options) {
    return this.request('DELETE', uri, options);
  }
}
