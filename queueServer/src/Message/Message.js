const uuid = require('node-uuid');

module.exports = class Message {
  constructor(messageBody) {
    this.body = messageBody;
    this.id = uuid.v4();
    this.created = (new Date()).getTime();
  }
}
