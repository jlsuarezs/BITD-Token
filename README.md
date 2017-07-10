# BITDToken ICO contract
## Testing

These contracts have been developed using the Truffle framework:  
https://github.com/trufflesuite/truffle

To test, you can:

1. Run `testrpc` (see https://github.com/ethereumjs/testrpc).
1. Run `truffle test`

Expected output from test is:
```
Adams-MBP:BITDToken adamdossa$ truffle test
Using network 'development'.

Compiling ./contracts/BITDToken.sol...
Compiling ./contracts/Migrations.sol...
Compiling ./contracts/test/BITDTokenMock.sol...
Compiling ./installed_contracts/zeppelin/contracts/SafeMath.sol...
Compiling ./installed_contracts/zeppelin/contracts/ownership/Ownable.sol...
Compiling ./installed_contracts/zeppelin/contracts/token/BasicToken.sol...
Compiling ./installed_contracts/zeppelin/contracts/token/ERC20.sol...
Compiling ./installed_contracts/zeppelin/contracts/token/ERC20Basic.sol...
Compiling ./installed_contracts/zeppelin/contracts/token/StandardToken.sol...
Coinbase Account:  0x0249f55a1294105933bf8fd88160bb022440dd6a


  Contract: BITDToken
Token Address:  0x2545df9f0ec008d9ef38b30890b0f6eae65901c1
    ✓ 0. initialize contract (297ms)

  Contract: BITDToken
    ✓ 1. start and end sale (434ms)

  Contract: BITDToken
    ✓ 2. checks amounts and bonuses (460ms)

  Contract: BITDToken
    ✓ 3. check transfers (505ms)

  Contract: BITDToken
    ✓ 4. allocate owner tokens (293ms)

  Contract: BITDToken
    ✓ 5. check limits (297ms)


  6 passing (2s)


```

## Deployment

I have provided three scripts to ease deployment:  
deploy.js  
startSale.js  
allocateOwnerTokens.js

These files have further instructions, but see below for basic usage.

1. deploy.js: Run using `node scripts/deploy.js build/contracts/BITDToken.json`. This will log out the new <contract_address>.
1. startSale.js: Run using `node scripts/startSale.js build/contracts/BITDToken.json <contract_address>`. Replace <contract_address> with the address logged from 1.
1. allocateOwnerTokens.js: `node scripts/allocateOwnerTokens.js build/contracts/BITDToken.json <contract_address>`. Replace <contract_address> with the address logged from 1. Note - this can only be run once the sale has completed.

Note - you will need some small amount of gas in your coinbase account to deploy contracts to mainnet.
