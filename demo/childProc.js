const queueClient = require('../queueClient');

process.on('message', (message) => {
  const processMessage = async () => {
    const { message } = await queueClient.receiveMessage();

    // Queue's probably empty, bail
    if (!message) return process.disconnect();

    // Artificial deletion delay so we can see how things work in the webview
    setTimeout(async () => {
      const { success } = await queueClient.deleteMessage(message.id);
      if (!success) {
        console.log('Error deleting message: ', message);
      }

      processMessage();
    }, 100);
  };
  processMessage();
});
