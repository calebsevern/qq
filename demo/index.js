const childProcess = require('child_process');
const processors = require('os').cpus().length;

(async function() {
  // Populate queue
  const queueClient = require('../queueClient');
  for (let i = 0; i < 1000; i += 1) {
    await queueClient.sendMessage({ foo: Math.random() });
  }

  // Child procs for parallelization
  for (let i = 0; i < processors; i += 1) {
    const worker = childProcess.fork('./childProc');
    worker.send('processMessages');
  }
})();
