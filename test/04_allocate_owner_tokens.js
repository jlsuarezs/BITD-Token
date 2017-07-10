const BITDTokenMock = artifacts.require("./BITDTokenMock.sol");
const assertFail = require("./helpers/assertFail");

contract('BITDToken', function (accounts) {

  const ONEETHER  = 1000000000000000000;
  const ETHERRATIO = ONEETHER / 10**12;
  const MULTIPLIER = 10**12;

  it("4. allocate owner tokens", async () => {

    var instance = await BITDTokenMock.new({from: accounts[0]});

    //Check can't allocate before sale
    await assertFail(async () => {
      await instance.allocateOwnerTokens({from: accounts[0]});
    })

    await instance.setMockedNow(1);

    await instance.allocateTeamTokens();

    //Check can't reallocate team tokens
    await assertFail(async () => {
      await instance.allocateTeamTokens({from: accounts[0]});
    })

    await instance.startSale({from: accounts[0]});

    //Check can't allocate during sale
    await assertFail(async () => {
      await instance.allocateOwnerTokens({from: accounts[0]});
    })

    await instance.setMockedNow(3456000);

    //Check can allocate after sale
    await instance.allocateOwnerTokens({from: accounts[0]});

    var accountBalance = await instance.balanceOf(accounts[0]);

    assert.equal(accountBalance.toNumber(), 7000000 * MULTIPLIER, "owner account should have all allocations");

    //Check can't allocate twice
    await assertFail(async () => {
      await instance.allocateOwnerTokens({from: accounts[0]});
    })


  });

});
