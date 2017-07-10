const BITDTokenMock = artifacts.require("./BITDTokenMock.sol");
const assertFail = require("./helpers/assertFail");

contract('BITDToken', function (accounts) {

  const ONEETHER  = 1000000000000000000;
  const ETHERRATIO = ONEETHER / 10**12;
  const MULTIPLIER = 10**12;

  const ONEDAY = 86400;

  const ONEWEEK = 604800;

  it("3. check transfers", async () => {

    var instance = await BITDTokenMock.new({from: accounts[0]});

    //fail before initial balances
    await assertFail(async () => {
      await instance.transfer(accounts[1], 100 * MULTIPLIER, {from: accounts[0]});
    })

    await instance.allocateTeamTokens();

    //Check owner can transfer funds
    await instance.transfer(accounts[1], 100 * MULTIPLIER, {from: accounts[0]});

    var accountBalance = await instance.balanceOf(accounts[1]);

    assert.equal(accountBalance.toNumber(), 100 * MULTIPLIER, "100 tokens should be transferred");

    //Check non-owner can transfer funds
    await instance.transfer(accounts[2], 100 * MULTIPLIER, {from: accounts[1]});

    accountBalance = await instance.balanceOf(accounts[1]);

    assert.equal(accountBalance.toNumber(), 0 * MULTIPLIER, "100 tokens should be transferred");

    //Start sale
    await instance.setMockedNow(1);

    await instance.startSale({from: accounts[0]});

    //Check owner can transfer funds
    await instance.transfer(accounts[1], 100 * MULTIPLIER, {from: accounts[0]});

    accountBalance = await instance.balanceOf(accounts[1]);

    assert.equal(accountBalance.toNumber(), 100 * MULTIPLIER, "100 tokens should be transferred");

    //Check non-balance holder can't transfer funds
    await assertFail(async () => {
      await instance.transfer(accounts[4], 100 * MULTIPLIER, {from: accounts[3]});
    })

    //Finish sale
    await instance.setMockedNow(3456000);

    //Check owner can transfer funds
    await instance.transfer(accounts[1], 100 * MULTIPLIER, {from: accounts[0]});

    accountBalance = await instance.balanceOf(accounts[1]);

    assert.equal(accountBalance.toNumber(), 200 * MULTIPLIER, "100 tokens should be transferred");

    //Check non-owner can transfer funds
    await instance.transfer(accounts[2], 100 * MULTIPLIER, {from: accounts[1]});

    accountBalance = await instance.balanceOf(accounts[2]);

    assert.equal(accountBalance.toNumber(), 200 * MULTIPLIER, "100 tokens should be transferred");

  });
});
