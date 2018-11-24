var PrivateKeyProvider = require("truffle-privatekey-provider");

module.exports = {
  networks: {
    ganache: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*",
    },
    tenderly: {
      host: "127.0.0.1",
      port: 9545,
      network_id: "*",
      gasPrice: 0
    },
    kovan: {
      provider: function () {
        return new PrivateKeyProvider("<private-key-here>", "https://kovan.infura.io");
      },
      network_id: '42',
      gasPrice: 20000,
    },
  },
};
