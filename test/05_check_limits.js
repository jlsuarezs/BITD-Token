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

  it("5. check limits", async () => {

    var instance = await BITDTokenMock.new({from: accounts[0]});

    await instance.setMockedNow(1);

    await instance.allocateTeamTokens();

    await instance.startSale({from: accounts[0]});

    await instance.createTokens(accounts[1], {from: accounts[1], value: ONEETHER * 19000});

    var accountBalance = await instance.balanceOf(accounts[1]);

    assert.equal(accountBalance.toNumber(), 6270000 * MULTIPLIER, "Balance should be 6270000");

    await assertFail(async () => {
      await instance.createTokens(accounts[1], {from: accounts[1], value: ONEETHER * 100});
    })

    //Complete saloe
    await instance.setMockedNow(3456000);

    //Check can allocate after sale
    await instance.allocateOwnerTokens({from: accounts[0]});

    accountBalance = await instance.balanceOf(accounts[0]);

    assert.equal(accountBalance.toNumber(), 730000 * MULTIPLIER, "Balance should be 730000");

  });
});
