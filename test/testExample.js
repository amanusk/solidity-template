/* eslint-env node, mocha */
/* global artifacts, contract, web3 */
/* eslint no-underscore-dangle: 1 */
const { BN } = web3.utils;

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
const { assert } = chai;

const ERC20 = artifacts.require('./Mocks/MockToken.sol');

contract('MockExchange', (accounts) => {
  const [user, ercOwner] = accounts;

  const tokenName = 'MockToken';
  const tokenSymbol = 'ERC20';
  const initialTotalSupply = web3.utils.toWei('10000000000000000000');
  const decimals = 18;

  describe('Text Mock Contract', () => {
    let MockTokenInstance;

    describe('Send Funds to User', async () => {
      beforeEach(async () => {
        // deploy mock token
        MockTokenInstance = await ERC20.new(
          tokenName,
          tokenSymbol,
          decimals,
          initialTotalSupply,
          { from: ercOwner },
        );
      });
      it('Should send 10 tokens to user', async () => {
        const initialUserBalance = await MockTokenInstance.balanceOf.call(user);
        const value = web3.utils.toWei('10');

        await MockTokenInstance.transfer(user, value, {
          from: ercOwner,
        });

        const finalUserBalance = await MockTokenInstance.balanceOf.call(user);
        assert.equal(
          finalUserBalance.toString(),
          initialUserBalance.add(new BN(value)).toString(),
        );
      });
    });
  });
});
