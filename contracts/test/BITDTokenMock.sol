pragma solidity ^0.4.11;

import '../BITDToken.sol';

contract BITDTokenMock is BITDToken {

  event MockNow(uint _now);

  uint mock_now = 1;

  function BITDTokenMock() {}

  function getNow() internal constant returns (uint) {
      return mock_now;
  }

  function setMockedNow(uint _b) public {
      mock_now = _b;
      MockNow(_b);
  }

}
