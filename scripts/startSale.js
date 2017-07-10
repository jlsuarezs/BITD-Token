// ===========================================================================
//
// $ node startSale.js <path-to-json> <contract_address>
//
// set sale start time to 'now' - will run for one month
//
// ===========================================================================

var BITDData = require('./BITDToken');

var BITDToken = BITDData.getContract( process.argv[2], process.argv[3] );


console.log("Current Sale Time: " + BITDToken.saleStartTime());

BITDToken.startSale({from: BITDData.getCoinbase(), gas:  800000}, function(err,instance) {
  if (err) {
    console.log( "Error: ", err );
  } else {
    console.log( "Sale started");
  }
});
