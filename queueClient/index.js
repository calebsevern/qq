const Sender = require('./src/Sender/Sender');
const Consumer = require('./src/Consumer/Consumer');

module.exports = {
  sendMessage: Sender.send,
  receiveMessage: Consumer.get,
  deleteMessage: Consumer.delete,
  purgeQueue: Consumer.purgeQueue,
};
