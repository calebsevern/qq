const assert = require('assert');
const config = require('../../config');
const Queue = require('./Queue');

describe('Queue', function() {
  it('init should create an empty queue and lock map', function() {
    const queue = new Queue(config);
    assert.equal(0, queue.queue.length);
    assert.equal(0, Object.keys(queue.lockedMessages).length);
    assert.equal('number', typeof queue.ttl);
  });

  it('.add(message) should add a message to the queue', function() {
    const queue = new Queue(config);

    queue.add({ foo: 'bar' });
    assert.equal(1, queue.queue.length);

    queue.add('Message');
    assert.equal(2, queue.queue.length);

    queue.add(Buffer.from('bufferMessage'));
    assert.equal(3, queue.queue.length);
  });

  it('.get() should fetch a message and add it to the lock map', function() {
    const queue = new Queue(config);
    queue.add({ foo: 'bar' });

    const message = queue.get();
    assert(true, message.success);
    assert.equal(0, queue.queue.length);
    assert.equal(true, queue.lockedMessages.hasOwnProperty(message.message.id));

    const secondMessage = queue.get();
    assert.equal(false, secondMessage.success);
  });

  it('should expect messages to time out if TTL exceeded', function(done) {
    const queue = new Queue(Object.assign(config, { messageTTL: 50 }));
    queue.add({ foo: 'bar' });
    queue.get();
    assert.equal(0, queue.queue.length);
    setTimeout(() => {
      assert.equal(1, queue.queue.length);
      done();
    }, 60);
  });

  it('.delete() should delete messages from lock map', function() {
    const queue = new Queue(config);
    queue.add({ foo: 'bar' });

    const { message } = queue.get();
    assert.equal(0, queue.queue.length);
    assert.equal(true, queue.lockedMessages.hasOwnProperty(message.id));

    queue.delete(message.id);
    assert.equal(0, queue.queue.length);
    assert.equal(false, queue.lockedMessages.hasOwnProperty(message.id));
  });

  it('.purge() should purge queue and lock map', function() {
    const queue = new Queue(config);
    queue.add({ foo: 'bar' });
    queue.add({ foo: 'baz' });

    queue.get();
    assert.equal(1, queue.queue.length);
    assert.equal(1, Object.keys(queue.lockedMessages).length);

    queue.purge();
    assert.equal(0, queue.queue.length);
    assert.equal(0, Object.keys(queue.lockedMessages).length);
  });

  it('.status() should return friendly JSON representation of queue state', function() {
    const queue = new Queue(config);
    queue.add({ foo: 'bar' });
    queue.add({ foo: 'baz' });
    queue.get();

    const queueStatus = queue.status();
    assert.equal(1, queueStatus.queue.length);
    assert.equal(1, Object.keys(queueStatus.lockedMessages).length);
  });
});
