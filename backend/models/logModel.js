class Log {
    constructor(endpoint, method, userAgent, timestamp) {
      this.endpoint = endpoint;
      this.method = method;
      this.userAgent = userAgent;
      this.timestamp = timestamp;
    }
  }
  
  module.exports = Log;
  