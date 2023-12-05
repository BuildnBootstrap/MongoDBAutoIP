const ipUtils = require('./ipUtils');


function setup(config) {
  return {
    checkAndUpdateIP: async () => {
      const currentIP = await ipUtils.getCurrentIP();
      await ipUtils.addToWhitelist(currentIP, config);
    }
  };
}

module.exports = { setup };