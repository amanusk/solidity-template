# Solidity template

Template for building testing and deploying solidity smart contracts

## Installation

- You need to have version of the solidity compiler installed.  
  Install from your package manager or from the [releases](https://github.com/ethereum/solidity/releases) page

* `npm install`

## Adding private keys + infura keys

To deploy to testnet/mainnet, you need an account with some ETH for gas.
Create a file called `.secret` with the private key of you account.
No `0x` prefix required

## Contract development

### Contracts compilation

If you have truffle globally installed, compile the contracts with

- `truffle compile`

Truffle is also available at  
`./node_modules/.bin/truffle`

### Run ganache-cli

- `npm run ganache`

### Run Contract tests

- `npm run ganache`  
  In a separate terminal
- `truffle test`

### Test with events

`truffle test --show-events`

### Deploy smart contracts to testnet

- `truffle migrate -f 2 --to 2 --network ropsten`  
  Notice you need a .secret file with a private key with some testnet ETH to deploy the contract

## Testing on ropsten

Before testing, make sure to update the address of the contract in the test file

Test command:

- `npm run test:ropsten`

## Running coverage tests

Run a coverage test with:  
`npm run test:coverage`

This will create a .coverage directory, where you can explore coverage
