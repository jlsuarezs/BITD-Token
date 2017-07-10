const BITDTokenMock = artifacts.require("./BITDTokenMock.sol");
const assertFail = require("./helpers/assertFail");

contract('BITDToken', function (accounts) {

  const ONEETHER  = 1000000000000000000;
  const TWOETHER = 2000000000000000000;
  const HALFETHER = 500000000000000000;
  const ETHERRATIO = ONEETHER / 10**12;
  const MULTIPLIER = 10**12;

  const ONEDAY = 86400;

  const ONEWEEK = 604800;

  it("2. checks amounts and bonuses", async () => {

    var instance = await BITDTokenMock.new({from: accounts[0]});

    await instance.setMockedNow(1);

    await instance.allocateTeamTokens();

    await instance.startSale({from: accounts[0]});

    // < 1 day bonus

    await instance.createTokens(accounts[1], {from: accounts[1], value: ONEETHER});

    var accountBalance = await instance.balanceOf(accounts[1]);

    assert.equal(accountBalance.toNumber(), 330 * MULTIPLIER, "Balance should be 330");

    // < 1 week bonus

    await instance.setMockedNow(1 + ONEDAY);

    await instance.createTokens(accounts[2], {from: accounts[2], value: ONEETHER});

    accountBalance = await instance.balanceOf(accounts[2]);

    assert.equal(accountBalance.toNumber(), 330 * MULTIPLIER, "Balance should be 330");

    // < 2 week bonus

    await instance.setMockedNow(1 + ONEWEEK);

    //Check min purchase fails
    await assertFail(async () => {
      await instance.createTokens(accounts[3], {from: accounts[3], value: HALFETHER});
    })

    await instance.createTokens(accounts[3], {from: accounts[3], value: TWOETHER});

    accountBalance = await instance.balanceOf(accounts[3]);

    assert.equal(accountBalance.toNumber(), 630 * MULTIPLIER, "Balance should be 630");

    // < no bonus

    await instance.setMockedNow(1 + 2 * ONEWEEK);

    await instance.createTokens(accounts[4], {from: accounts[4], value: ONEETHER});

    accountBalance = await instance.balanceOf(accounts[4]);

    assert.equal(accountBalance.toNumber(), 300 * MULTIPLIER, "Balance should be 300");

  });
});
