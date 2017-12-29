pragma solidity ^0.4.11;

import './StandardToken.sol';
import "./UpgradeableToken.sol";
import "./ReleasableToken.sol";
import "./MintableToken.sol";


/**
 * A crowdsaled token.
 *
 * An ERC-20 token designed specifically for crowdsales with investor protection and further development path.
 *
 * - The token transfer() is disabled until the crowdsale is over
 * - The token contract gives an opt-in upgrade path to a new contract
 * - The same token can be part of several crowdsales through approve() mechanism
 * - The token can be capped (supply set in the constructor) or uncapped (crowdsale contract can mint new tokens)
 *
 */
contract CrowdsaleToken is ReleasableToken, MintableToken, UpgradeableToken {

  event UpdatedTokenInformation(string newName, string newSymbol);
  event ProfitDelivered(address fetcher, uint profit);
  event ProfitLoaded(address owner, uint profit);
  string public name;

  string public symbol;

  uint8 public decimals;
  uint loadedProfit;
  bool ditributingProfit;
  uint profitDistributed;
  uint loadedProfitAvailable;

  /** Whether an addresses has fetched profit of not*/
  mapping (address => bool) public hasFetchedProfit;

  /**
   * Construct the token.
   *
   * This token must be created through a team multisig wallet, so that it is owned by that wallet.
   *
   * @param _name Token name
   * @param _symbol Token symbol - should be all caps
   * @param _initialSupply How many tokens we start with
   * @param _decimals Number of decimal places
   * @param _mintable Are new tokens created over the crowdsale or do we distribute only the initial supply? Note that when the token becomes transferable the minting always ends.
   */
  function CrowdsaleToken(string _name, string _symbol, uint _initialSupply, uint8 _decimals, bool _mintable)
    UpgradeableToken(msg.sender) {

    // Create any address, can be transferred
    // to team multisig via changeOwner(),
    // also remember to call setUpgradeMaster()
    owner = msg.sender;

    name = _name;
    symbol = _symbol;

    totalSupply = _initialSupply;

    decimals = _decimals;

    // Create initially all balance on the team multisig
    balances[owner] = totalSupply;

    if(totalSupply > 0) {
      Minted(owner, totalSupply);
    }

    // No more new supply allowed after the token creation
    if(!_mintable) {
      mintingFinished = true;
      require(totalSupply != 0);
      // if(totalSupply == 0) {
      //   throw; // Cannot create a token without supply and no minting
      // }
    }
  }

  /**
   * When token is released to be transferable, enforce no new tokens can be created.
   */
  function releaseTokenTransfer() public onlyReleaseAgent {
    mintingFinished = true;
    super.releaseTokenTransfer();
  }

  /**
   * Allow upgrade agent functionality kick in only if the crowdsale was success.
   */
  function canUpgrade() public constant returns(bool) {
    return released && super.canUpgrade();
  }

  /**
   * Owner can update token information here
   */
  function setTokenInformation(string _name, string _symbol) onlyOwner {
    name = _name;
    symbol = _symbol;
    UpdatedTokenInformation(name, symbol);
  }

  /**
   * Allow load profit on the contract for the payout.
   *
   * 
   */
  function loadProfit() public payable onlyOwner {
    require(released);
    require(!ditributingProfit);
    require(msg.value != 0);
    loadedProfit = msg.value;
    loadedProfitAvailable = loadedProfit;
    ditributingProfit = true;
    ProfitLoaded(msg.sender, loadedProfit);
  }

  /**
   * Investors can claim profit if loaded.
   */
  function fetchProfit() public returns(bool) {
    require(ditributingProfit);
    require(!hasFetchedProfit[msg.sender]);
    uint NBCBalanceOfFetcher = balanceOf(msg.sender);
    require(NBCBalanceOfFetcher != 0);

    uint weiValue = safeMul(loadedProfit,NBCBalanceOfFetcher)/totalSupply;
    require(weiValue >= msg.gas);

    loadedProfitAvailable = safeSub(loadedProfitAvailable, weiValue);
    hasFetchedProfit[msg.sender] = true;

    profitDistributed = safeAdd(profitDistributed, weiValue);

      if(loadedProfitAvailable <= 0) { 
       ditributingProfit = false;
        loadedProfit = 0;
    }

    require(msg.sender.send(weiValue)); 
    // require(msg.sender.call.value(weiValue) == true);
    ProfitDelivered(msg.sender, weiValue);
    
  }

  /**
   * Allow owner to unload the loaded profit which could not be claimed.
   * Owner must be responsible to call it at the right time.
   * 
   */
  function fetchUndistributedProfit() public onlyOwner {
    require(loadedProfitAvailable != 0);
    require(msg.sender.send(loadedProfitAvailable));
    loadedProfitAvailable = 0;
    ditributingProfit = false;
    loadedProfit = 0;
  }

}