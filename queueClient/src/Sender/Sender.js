const request = require('request');
const BASE_URL = 'http://localhost:3000';
const ADD_URL = `${BASE_URL}/add`;

module.exports = class Sender {
  constructor() {
    console.log('Sender initialized.');
  }

  static send(message) {
    return new Promise((resolve, reject) => {
      request.post({
        url: ADD_URL,
        json: { message },
      }, (err, response, body) => {
        if (err) {
          console.log('Error sending message:', err);
        }

        return resolve(body);
      });
    });
  }
}
