const TennisMatch = artifacts.require("TennisMatch");

module.exports = function (deployer) {
  deployer.deploy(TennisMatch);
};
