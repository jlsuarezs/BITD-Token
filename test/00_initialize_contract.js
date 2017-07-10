//testrpc --account="0xf84e9b54634b7a970ea64e11443b466758d33ae7ef3f9066b52457fc27a37e1c, 1000000000000000000000000" --account="0xf84e9b54634b7a970ea64e11443b466758d33ae7ef3f9066b52457fc27a37e11, 1000000000000000000000000" --account="0xf84e9b54634b7a970ea64e11443b466758d33ae7ef3f9066b52457fc27a37e12, 1000000000000000000000000" --account="0xf84e9b54634b7a970ea64e11443b466758d33ae7ef3f9066b52457fc27a37e13, 1000000000000000000000000" --account="0xf84e9b54634b7a970ea64e11443b466758d33ae7ef3f9066b52457fc27a37e14, 1000000000000000000000000" --account="0xf84e9b54634b7a970ea64e11443b466758d33ae7ef3f9066b52457fc27a37e15, 1000000000000000000000000" --account="0xf84e9b54634b7a970ea64e11443b466758d33ae7ef3f9066b52457fc27a37e16, 1000000000000000000000000" -p 8547


const BITDTokenMock = artifacts.require("./BITDTokenMock.sol");

contract('BITDToken', function (accounts) {

  console.log("Coinbase Account: ", accounts[0]);
  const ONEETHER  = 10**18;
  const MULTIPLIER = 10**12;
  const TEAM_SUPPLY = 700000 * MULTIPLIER;

  // =========================================================================
  it("0. initialize contract", async () => {

    var instance = await BITDTokenMock.new({from: accounts[0]});

    console.log("Token Address: ", instance.address);

    var owner = await instance.owner();
    assert.equal(owner, accounts[0], "owner is set correctly");

    var totalSupply = await instance.totalSupply();
    assert.equal(totalSupply.toNumber(), 0, "Initial totalSupply should be 0");

    //init
    await instance.allocateTeamTokens();
    totalSupply = await instance.totalSupply();
    assert.equal(totalSupply.toNumber(), TEAM_SUPPLY, "Initial totalSupply should be TEAM_SUPPLY");

    var saleStartTime = await instance.saleStartTime();

    assert.equal(saleStartTime.toNumber(), 0, "saleStartTime should be 0");

    var accountBalance = await instance.balanceOf(owner);
    assert.equal(accountBalance.toNumber(), TEAM_SUPPLY, "TEAM_SUPPLY should be owners initial balance")

  });

});
