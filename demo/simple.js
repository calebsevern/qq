(async function() {
  // Populate queue
  const queueClient = require('../queueClient');
  for (let i = 0; i < 10; i += 1) {
    await queueClient.sendMessage({ foo: Math.random() });
  }

  const { message } = await queueClient.receiveMessage();
  setTimeout(async () => {
    await queueClient.purgeQueue();
    const aa = await queueClient.deleteMessage(message.id);
    console.log(aa);
  }, 4000);
})();
