const assert = require('assert');
const Message = require('./Message');

describe('Message', function() {
  it('should assign unique ID to new message', function() {
    const message = new Message();
    assert.equal('string', typeof message.id);
    assert.equal(36, message.id.length);
  });

  it('should timestamp all new messages', function() {
    const now = (new Date()).getTime();
    const message = new Message();
    assert.equal('number', typeof message.created);

    // Very rough timestamp check to ensure nothing wacky is happening,
    // e.g. tz offset, new date lib or unix date implementation
    assert.equal(true, (message.created - now) < 100);
  });

  it('should accept arbitrary data types for body', function() {
    const numMessage = new Message(42);
    assert.equal(42, numMessage.body);

    const stringMessage = new Message('foo');
    assert.equal('foo', stringMessage.body);

    const jsonMessage = new Message({ foo: 'bar' });
    assert.equal('bar', jsonMessage.body.foo);

    const bufferMessage = new Message(Buffer.from('foo'));
    assert.equal('object', typeof bufferMessage.body);
    assert.equal('foo', bufferMessage.body.toString());
  });
});
