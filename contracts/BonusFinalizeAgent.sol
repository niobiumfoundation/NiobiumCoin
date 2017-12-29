pragma solidity ^0.4.11;

import "./Crowdsale.sol";
import "./CrowdsaleToken.sol";
import "./SafeMathLib.sol";

/**
 * At the end of the successful crowdsale allocate % bonus of tokens to the team.
 *
 * Unlock tokens.
 *
 * BonusAllocationFinal must be set as the minting agent for the MintableToken.
 *
 */
contract BonusFinalizeAgent is FinalizeAgent, SafeMathLib {

  CrowdsaleToken public token;
  Crowdsale public crowdsale;

  /** Total percent of tokens minted to the team at the end of the sale as base points (0.0001) */
  uint public totalMembers;
  // Per address % of total token raised to be assigned to the member Ex 1% is passed as 100
  uint public allocatedBonus;
  mapping (address=>uint) bonusOf;
  /** Where we move the tokens at the end of the sale. */
  address[] public teamAddresses;


  function BonusFinalizeAgent(CrowdsaleToken _token, Crowdsale _crowdsale, uint[] _bonusBasePoints, address[] _teamAddresses) {
    token = _token;
    crowdsale = _crowdsale;

    //crowdsale address must not be 0
    require(address(crowdsale) != 0);

    //bonus & team address array size must match
    require(_bonusBasePoints.length == _teamAddresses.length);

    totalMembers = _teamAddresses.length;
    teamAddresses = _teamAddresses;
    
    //if any of the bonus is 0 throw
    // otherwise sum it up in totalAllocatedBonus
    for (uint i=0;i<totalMembers;i++){
      require(_bonusBasePoints[i] != 0);
      //if(_bonusBasePoints[i] == 0) throw;
    }

    //if any of the address is 0 or invalid throw
    //otherwise initialize the bonusOf array
    for (uint j=0;j<totalMembers;j++){
      require(_teamAddresses[j] != 0);
      //if(_teamAddresses[j] == 0) throw;
      bonusOf[_teamAddresses[j]] = _bonusBasePoints[j];
    }
  }

  /* Can we run finalize properly */
  function isSane() public constant returns (bool) {
    return (token.mintAgents(address(this)) == true) && (token.releaseAgent() == address(this));
  }

  /** Called once by crowdsale finalize() if the sale was success. */
  function finalizeCrowdsale() {

    // if finalized is not being called from the crowdsale 
    // contract then throw
    require(msg.sender == address(crowdsale));

    // if(msg.sender != address(crowdsale)) {
    //   throw;
    // }

    // get the total sold tokens count.
    uint tokensSold = crowdsale.tokensSold();

    for (uint i=0;i<totalMembers;i++) {
      allocatedBonus = safeMul(tokensSold, bonusOf[teamAddresses[i]]) / 10000;
      // move tokens to the team multisig wallet
      
      // Give min bonus to advisor as committed
      // the last address is the advisor address
      uint minBonus = 1000000 * 1000000000000000000;
      if (i == totalMembers-1 && allocatedBonus < minBonus)
        allocatedBonus = minBonus;

      token.mint(teamAddresses[i], allocatedBonus);
    }

    // Make token transferable
    // realease them in the wild
    // Hell yeah!!! we did it.
    token.releaseTokenTransfer();
  }

}
