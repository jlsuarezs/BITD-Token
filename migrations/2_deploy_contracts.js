var BITDToken = artifacts.require("./BITDToken.sol");
// var OxTokenMock = artifacts.require("./test/OxTokenMock.sol");
var SafeMath = artifacts.require("../installed_contracts/zeppelin/contracts/SafeMath.sol");

module.exports = function(deployer) {
  deployer.deploy(SafeMath);
  deployer.link(SafeMath, BITDToken);
  deployer.deploy(BITDToken);
  //Just for testing - comment out for real deployment
  // deployer.deploy(BITDTokenMock);
};
