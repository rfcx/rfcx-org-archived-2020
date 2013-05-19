exports.nodefly = {
  app: [
    "rfcx-api-express"
  ],
  options: {
    // time in ms when the event loop is considered blocked
    blockThreshold: 10
  }
};