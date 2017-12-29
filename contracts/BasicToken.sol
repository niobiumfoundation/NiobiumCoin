pragma solidity ^0.4.11;


import './ERC20Basic.sol';
import './SafeMathLib.sol';


/**
 * @title Basic token
 * @dev Basic version of StandardToken, with no allowances. 
 */
contract BasicToken is ERC20Basic, SafeMathLib {

  mapping(address => uint) balances;



  /**
  * @dev transfer token for a specified address
  * @param _to The address to transfer to.
  * @param _value The amount to be transferred.
  */
  function transfer(address _to, uint _value) returns (bool success) {
    if (balances[msg.sender] >= _value 
      && _value > 0 
      && balances[_to] + _value > balances[_to]
      ) {
    balances[msg.sender] = safeSub(balances[msg.sender],_value);
    balances[_to] = safeAdd(balances[_to],_value);
    Transfer(msg.sender, _to, _value);
    return true;
  } else {
    return false;
  }

  }

  /**
  * @dev Gets the balance of the specified address.
  * @param _owner The address to query the the balance of. 
  * @return An uint representing the amount owned by the passed address.
  */
  function balanceOf(address _owner) constant returns (uint balance) {
    return balances[_owner];
  }

}
