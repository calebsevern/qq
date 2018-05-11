const Message = require('../Message/Message');

module.exports = class Queue {
  constructor({ messageTTL }) {
    this.queue = [];
    this.lockedMessages = {};
    this.ttl = messageTTL;
  }

  add(messageBody) {
    if (!messageBody) {
      return { success: false, error: 'Message body required.' };
    }

    const newMessage = new Message(messageBody);
    this.queue.push(newMessage);
    return { success: true, messageId: newMessage.id };
  }

  get() {
    if (!this.queue.length) {
      return { success: false, error: 'Message queue empty.' };
    }

    const message = this.queue.shift();
    this.lockedMessages[message.id] = message;
    this.startProcessingClock(message.id);
    return { success: true, message };
  }

  delete(messageId) {
    if (!this.lockedMessages[messageId]) {
      for (let i = 0; i < this.queue.length; i += 1) {
        const message = this.queue[i];
        if (message.id === messageId) {
          // Message either timed out or was never processed to begin with
          return { success: false, error: `Messages must be processed within ${this.ttl}ms.` };
        }
      }

      return { success: false, error: 'Message not found.' }; 
    }

    delete this.lockedMessages[messageId];
    return { success: true, messageId };
  }

  purge() {
    this.queue = [];
    this.lockedMessages = {};
    return { success: true };
  }

  startProcessingClock(messageId) {
    setTimeout(() => {
      // Message was not deleted
      if (this.lockedMessages[messageId]) {
        this.queue.unshift(this.lockedMessages[messageId]);
        delete this.lockedMessages[messageId];
      }
    }, this.ttl);
  }

  status() {
    return {
      queue: this.queue,
      lockedMessages: this.lockedMessages,
    };
  }
}
