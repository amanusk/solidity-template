/* global artifacts */
const Example = artifacts.require('./Example.sol');

module.exports = async (deployer) => {
  await deployer.deploy(Example);
};
