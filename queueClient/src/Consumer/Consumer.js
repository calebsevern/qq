const request = require('request');
const BASE_URL = 'http://localhost:3000';
const GET_URL = `${BASE_URL}/get`;
const DELETE_URL = `${BASE_URL}/delete`;
const PURGE_URL = `${BASE_URL}/purge`;

module.exports = class Consumer {
  constructor() {
    console.log('Consumer initialized.');
  }

  static get() {
    return new Promise((resolve, reject) => {
      request.get(GET_URL, (err, response, body) => {
        if (err) {
          console.log('Error getting message:', err);
        }

        return resolve(JSON.parse(body));
      });
    });
  }

  static delete(messageId) {
    return new Promise((resolve, reject) => {
      request.post({
        url: DELETE_URL,
        json: { messageId },
      }, (err, response, body) => {
        if (err) {
          console.log('Error deleting message:', err);
        }

        return resolve(body);
      });
    });
  }

  static purgeQueue() {
    return new Promise((resolve, reject) => {
      request.post({
        url: PURGE_URL,
        json: {},
      }, (err, response, body) => {
        if (err) {
          console.log('Error purging queue:', err);
        }

        return resolve(body);
      });
    });
  }
};
