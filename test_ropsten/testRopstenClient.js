const chai = require('chai');

const EthereumTx = require('ethereumjs-tx').Transaction;

const { assert } = chai;
const Web3 = require('web3');
const fs = require('fs');
const { BN } = web3.utils;

const infuraKey = fs.readFileSync('.infura_key').toString().trim();

const web3 = new Web3(
  new Web3.providers.HttpProvider('https://ropsten.infura.io/v3/' + infuraKey),
);

const tokenJson = require('../build/contracts/MockToken.json');

const SRC_TOKEN_ADDRESS = '<Put address here>';
const SRC_DECIMALS = 18;
const MAX_ALLOWANCE =
  '115792089237316195423570985008687907853269984665640564039457584007913129639935';

// Trade Details

const SRC_QTY = '10';
const SRC_QTY_WEI = (SRC_QTY * 10 ** SRC_DECIMALS).toString();

const userPrivateKey = fs.readFileSync('.secret').toString().trim();

// Token
let erc20;
// Contract ABIs and addresses
const erc20Interface = tokenJson.abi;

// Users
let user;

async function generateTX(
  account,
  contractAddress,
  data,
  value,
  nonce,
  gasPrice,
  gasLimit,
) {
  console.log('Sending from address', account.address);
  if (nonce == null) {
    /* eslint-disable no-param-reassign */
    nonce = await web3.eth.getTransactionCount(account.address);
  }
  console.log('Nonce: ', nonce);

  if (gasPrice == null) {
    /* eslint-disable no-param-reassign */
    gasPrice = Number(await web3.eth.getGasPrice());
  }
  const gasPriceHex = web3.utils.toHex(gasPrice);

  if (gasLimit == null) {
    /* eslint-disable no-param-reassign */
    gasLimit = await web3.eth.estimateGas({
      from: account.address,
      to: contractAddress,
      data,
      value,
    });
  }
  const gasLimitHex = web3.utils.toHex(gasLimit);

  console.log('Gas Price: ', gasPrice);
  console.log('Gas Limit: ', gasLimit);

  const txParams = {
    nonce,
    gasPrice: gasPriceHex,
    gasLimit: gasLimitHex,
    to: contractAddress,
    value,
    data,
  };

  console.log('TX', txParams);
  return txParams;
}

async function signTX(signer, txParams) {
  // The second parameter is not necessary if these values are used
  const tx = new EthereumTx(txParams, {
    chain: 'ropsten',
    hardfork: 'petersburg',
  });
  tx.sign(Buffer.from(signer.privateKey, 'hex'));
  const serializedTx = tx.serialize();
  return serializedTx;
}

async function broadcastTX(serializedTx) {
  return web3.eth
    .sendSignedTransaction(`0x${serializedTx.toString('hex')}`)
    .on('transactionHash', (hash) => {
      console.log('-'.repeat(20));
      console.log('on(transactionHash): hash =', hash);
    })
    .on('receipt', (receipt) => {
      console.log('-'.repeat(20));
      console.log(
        'Tx',
        receipt.transactionHash,
        ' included in block',
        receipt.blockNumber,
      );
    })
    .on('error', (error) => {
      console.log('-'.repeat(20));
      console.log('on(error): error =', error);
    });
}

/**
 * Execute any web3 transaction with passed parameters
 */
async function executeTX(account, contractAddress, data, value) {
  const tx = await generateTX(account, contractAddress, data, value);
  const serializedTx = await signTX(account, tx);
  return broadcastTX(serializedTx);
}

describe('Integration Test', () => {
  beforeEach(async () => {
    user = web3.eth.accounts.privateKeyToAccount(`0x${userPrivateKey}`);
    user.privateKey = user.privateKey.toString().substring(2);

    erc20 = await new web3.eth.Contract(erc20Interface, SRC_TOKEN_ADDRESS);
  });
  it('Read user token balance', async () => {
    // Starting information
    const initialUserTokenBalance = await erc20.methods
      .balanceOf(user.address)
      .call();
    console.log('Initial user token balance', initialUserTokenBalance);
  }).timeout(1000000);
});
