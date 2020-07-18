const PrivateKeyProvider = require('truffle-privatekey-provider');
const web3 = require('web3');

const fs = require('fs');

let privateKey;
let infuraKey;

try {
  privateKey = fs.readFileSync('.secret').toString().trim();
} catch (e) {
  console.log('Create a .secret file to upload to the blockchain');
}
try {
  infuraKey = fs.readFileSync('.infura_key').toString().trim();
} catch (e) {
  console.log('Create a .secret file to upload to the blockchain');
}

module.exports = {
  solc: {
    optimizer: {
      enabled: true,
      runs: 200,
    },
  },
  plugins: ['solidity-coverage'],

  networks: {
    development: {
      // $ npm run ganache
      host: 'localhost',
      port: 7545,
      network_id: '47',
      gas: 4700000,
      gasPrice: 6000000000,
    },
    coverage: {
      host: 'localhost',
      network_id: '48',
      port: 7545,
      gas: 17592186044415,
      gasPrice: 1,
    },

    ropsten: {
      provider() {
        return new PrivateKeyProvider(
          privateKey,
          `https://ropsten.infura.io/v3/${infuraKey}`,
        );
      },
      network_id: 3,
      gas: 4000000,
    },

    mainnet: {
      provider() {
        return new PrivateKeyProvider(
          privateKey,
          `https://mainnet.infura.io/v3/${infuraKey}`,
        );
      },
      network_id: 1,
      gasPrice: web3.utils.toWei('30', 'gwei'),
      gas: 1500000,
    },
  },
  mocha: {
    reporter: 'eth-gas-reporter',
    reporterOptions: {
      // gasPrice: config.gasPriceGWei, // if commented it's using the ethgasstation standard value
      currency: 'USD',
    },
  },
  compilers: {
    solc: {
      version: '0.5.15', // Fetch exact version from solc-bin (default: truffle's version)
      'allow-pathes': true,
      settings: {
        evmVersion: 'istanbul',
      },
    },
  },
};
