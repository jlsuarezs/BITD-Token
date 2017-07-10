//Start sale
//Chamnge ownership
//Init balances


pragma solidity ^0.4.11;

import '../installed_contracts/zeppelin/contracts/SafeMath.sol';
import '../installed_contracts/zeppelin/contracts/token/StandardToken.sol';
import '../installed_contracts/zeppelin/contracts/ownership/Ownable.sol';

contract BITDToken is StandardToken, Ownable {
  using SafeMath for uint;

  event BITDTokenInitialized(address _owner);
  event OwnerTokensAllocated(uint _amount);
  event TeamTokensAllocated(uint _amount);
  event TokensCreated(address indexed _tokenHolder, uint256 _contributionAmount, uint256 _tokenAmount);
  event SaleStarted(uint _saleStartime);

  string public name = "BITDToken";
  string public symbol = "BITD";

  uint public decimals = 12;
  uint public multiplier = 10**decimals;
  uint public etherRatio = SafeMath.div(1 ether, multiplier);

  uint public TOTAL_SUPPLY = SafeMath.mul(7000000, multiplier);
  uint public TEAM_SUPPLY = SafeMath.mul(700000, multiplier);
  uint public PRICE = 300; //1 Ether buys 300 BITD
  uint public MIN_PURCHASE = 10**18; // 1 Ether

  uint256 public saleStartTime = 0;
  bool public teamTokensAllocated = false;
  bool public ownerTokensAllocated = false;

  function BITDToken() {
    BITDTokenInitialized(msg.sender);
  }

  function allocateTeamTokens() public {
    if (teamTokensAllocated) {
      throw;
    }
    balances[owner] = balances[owner].add(TEAM_SUPPLY);
    totalSupply = totalSupply.add(TEAM_SUPPLY);
    teamTokensAllocated = true;
    TeamTokensAllocated(TEAM_SUPPLY);
  }

  function canBuyTokens() constant public returns (bool) {
    //Sale runs for 31 days
    if (saleStartTime == 0) {
      return false;
    }
    if (getNow() > SafeMath.add(saleStartTime, 31 days)) {
      return false;
    }
    return true;
  }

  function startSale() onlyOwner {
    //Must allocate team tokens before starting sale, or you may lose the opportunity
    //to do so if the whole supply is sold to the crowd.
    if (!teamTokensAllocated) {
      throw;
    }
    //Can only start once
    if (saleStartTime != 0) {
      throw;
    }
    saleStartTime = getNow();
    SaleStarted(saleStartTime);
  }

  function () payable {
    createTokens(msg.sender);
  }

  function createTokens(address recipient) payable {

    //Only allow purchases over the MIN_PURCHASE
    if (msg.value < MIN_PURCHASE) {
      throw;
    }

    //Reject if sale has completed
    if (!canBuyTokens()) {
      throw;
    }

    //Otherwise generate tokens
    uint tokens = msg.value.mul(PRICE);

    //Add on any bonus
    uint bonusPercentage = SafeMath.add(100, bonus());
    if (bonusPercentage != 100) {
      tokens = tokens.mul(percent(bonusPercentage)).div(percent(100));
    }

    tokens = tokens.div(etherRatio);

    totalSupply = totalSupply.add(tokens);

    //Don't allow totalSupply to be larger than TOTAL_SUPPLY
    if (totalSupply > TOTAL_SUPPLY) {
      throw;
    }

    balances[recipient] = balances[recipient].add(tokens);

    //Transfer Ether to owner
    owner.transfer(msg.value);

    TokensCreated(recipient, msg.value, tokens);

  }

  //Function to assign team & bounty tokens to owner
  function allocateOwnerTokens() public {

    //Can only be called once
    if (ownerTokensAllocated) {
      throw;
    }

    //Can only be called after sale has completed
    if ((saleStartTime == 0) || canBuyTokens()) {
      throw;
    }

    ownerTokensAllocated = true;

    uint amountToAllocate = SafeMath.sub(TOTAL_SUPPLY, totalSupply);
    balances[owner] = balances[owner].add(amountToAllocate);
    totalSupply = totalSupply.add(amountToAllocate);

    OwnerTokensAllocated(amountToAllocate);

  }

  function bonus() constant returns(uint) {

    uint elapsed = SafeMath.sub(getNow(), saleStartTime);

    if (elapsed < 1 weeks) return 10;
    if (elapsed < 2 weeks) return 5;

    return 0;
  }

  function percent(uint256 p) internal returns (uint256) {
    return p.mul(10**16);
  }

  //Function is mocked for tests
  function getNow() internal constant returns (uint256) {
    return now;
  }

}
