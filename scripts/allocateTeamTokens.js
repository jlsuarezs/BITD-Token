// ===========================================================================
//
// $ node allocateOwnerTokens.js <path-to-json> <contract_address>
//
// allocate team & bounty tokens. can only be run when sale completes
//
// ===========================================================================

var BITDData = require('./BITDToken');

var BITDToken = BITDData.getContract( process.argv[2], process.argv[3] );

BITDToken.allocateTeamTokens({from: BITDData.getCoinbase(), gas:  800000}, function(err,instance) {
  if (err) {
    console.log( "Error: ", err );
  } else {
    console.log( "Team tokens allocated");
  }
});
