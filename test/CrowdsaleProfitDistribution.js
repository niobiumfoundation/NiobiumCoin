'use strict';

const assertJump = require('./helpers/assertJump');
const timer = require('./helpers/timer');
var Token = artifacts.require("./CrowdsaleToken.sol");
var Crowdsale = artifacts.require("./MintedEthCappedCrowdsale.sol");
var FinalizeAgent = artifacts.require("./BonusFinalizeAgent.sol");
var MultisigWallet = artifacts.require('./MultisigWallet.sol');
var Pricing = artifacts.require("./EthTranchePricing.sol");


function etherInWei(x) {
    return web3.toBigNumber(web3.toWei(x, 'ether')).toNumber();
}


function tokenPriceInWeiFromTokensPerEther(x) {
    if (x == 0) return 0;
    return Math.floor(web3.toWei(1, 'ether') / x);
}

function tokenInSmallestUnit(tokens, _tokenDecimals) {
    return Math.floor(tokens * Math.pow(10, _tokenDecimals));
}

function getUnixTimestamp(timestamp) {
    var startTimestamp = new Date(timestamp);
    return Math.floor(startTimestamp.getTime() / 1000);
}

contract('CrowdsaleProfitDistribution: Success Scenario', function(accounts) {

    let shouldntFail = function(err) {
        assert.isFalse(!!err);
    };


    var _tokenName = "TOSHCOIN";
    var _tokenSymbol = "TOSH";
    var _tokenDecimals = 18;
    var _tokenInitialSupply = tokenInSmallestUnit(0, _tokenDecimals);
    var _tokenMintable = true;
    var _minRequired = 2;
    var _dayLimit = 2;
    var _listOfOwners = [accounts[1], accounts[2], accounts[3]];
    var _now = web3.eth.getBlock(web3.eth.blockNumber).timestamp;
    var _countdownInSeconds = 100;
    var _startTime = _now + _countdownInSeconds;
    var _saleDurationInSeconds = 1000;
    var _endTime = _startTime + _saleDurationInSeconds;
    var _minimumFundingGoal = etherInWei(3);
    var _cap = etherInWei(35);
    var _teamBonusPoints = [200, 200, 200];
    var _teamAddresses = [accounts[0], accounts[1], accounts[2]];
    var decimals = _tokenDecimals;
    var _tranches = [
        etherInWei(0), tokenPriceInWeiFromTokensPerEther(500),
        // etherInWei(10), tokenPriceInWeiFromTokensPerEther(1100),
        // etherInWei(15), tokenPriceInWeiFromTokensPerEther(1050),
        // etherInWei(20), tokenPriceInWeiFromTokensPerEther(1000),
        _cap, 0
    ];

    var tokenInstance;
    var pricingInstance;
    var finalizeAgentInstance;
    var multisigWalletInstance;
    var crowdsaleInstance;


    beforeEach(async() => {
        tokenInstance = await Token.new(_tokenName, _tokenSymbol, _tokenInitialSupply, _tokenDecimals, _tokenMintable);
        pricingInstance = await Pricing.new(_tranches);
        multisigWalletInstance = await MultisigWallet.new(_listOfOwners, _minRequired);
        crowdsaleInstance = await Crowdsale.new(tokenInstance.address, pricingInstance.address, multisigWalletInstance.address, _startTime, _endTime, _minimumFundingGoal, _cap);
        finalizeAgentInstance = await FinalizeAgent.new(tokenInstance.address, crowdsaleInstance.address, _teamBonusPoints, _teamAddresses);
    });

    it('Profits: Should not be able to load profit unless finalized', async function() {
        await tokenInstance.setMintAgent(crowdsaleInstance.address, true);
        await tokenInstance.setMintAgent(finalizeAgentInstance.address, true);
        await tokenInstance.setReleaseAgent(finalizeAgentInstance.address);
        await tokenInstance.setTransferAgent(crowdsaleInstance.address, true);
        await crowdsaleInstance.setFinalizeAgent(finalizeAgentInstance.address);
        assert.equal(await crowdsaleInstance.isFinalizerSane(), true, "Finalizer not sane. Can't continue.");
        assert.equal(await crowdsaleInstance.isPricingSane(), true, "Pricing not sane. Can't continue.");
        await timer(500);
        await crowdsaleInstance.buy({ from: accounts[1], value: web3.toWei('1', 'ether') });
        await crowdsaleInstance.buy({ from: accounts[2], value: web3.toWei('2', 'ether') });        

        try {
            await tokenInstance.loadProfit({ from: accounts[0], value: web3.toWei('2', 'ether') })
        } catch (error) {
            return assertJump(error);
        }

        assert.fail('should have thrown exception before');
    });
    it('Profits: Should be able to load profit when finalized', async function() {
        await tokenInstance.setMintAgent(crowdsaleInstance.address, true);
        await tokenInstance.setMintAgent(finalizeAgentInstance.address, true);
        await tokenInstance.setReleaseAgent(finalizeAgentInstance.address);
        await tokenInstance.setTransferAgent(crowdsaleInstance.address, true);
        await crowdsaleInstance.setFinalizeAgent(finalizeAgentInstance.address);
        assert.equal(await crowdsaleInstance.isFinalizerSane(), true, "Finalizer not sane. Can't continue.");
        assert.equal(await crowdsaleInstance.isPricingSane(), true, "Pricing not sane. Can't continue.");
        await timer(500);
        console.log(web3.eth.getBalance(accounts[1]));
        console.log(web3.eth.getBalance(accounts[2]));
        await crowdsaleInstance.buy({ from: accounts[1], value: web3.toWei('2', 'ether') });
        await crowdsaleInstance.buy({ from: accounts[2], value: web3.toWei('1', 'ether') });  
        await timer(700);
        await crowdsaleInstance.finalize();
        
        await tokenInstance.loadProfit({ from: accounts[0], value: web3.toWei('2', 'ether') });

    });

    it('Profits: Should not be able to load 0 profit', async function() {
        await tokenInstance.setMintAgent(crowdsaleInstance.address, true);
        await tokenInstance.setMintAgent(finalizeAgentInstance.address, true);
        await tokenInstance.setReleaseAgent(finalizeAgentInstance.address);
        await tokenInstance.setTransferAgent(crowdsaleInstance.address, true);
        await crowdsaleInstance.setFinalizeAgent(finalizeAgentInstance.address);
        assert.equal(await crowdsaleInstance.isFinalizerSane(), true, "Finalizer not sane. Can't continue.");
        assert.equal(await crowdsaleInstance.isPricingSane(), true, "Pricing not sane. Can't continue.");
        await timer(500);
        console.log(web3.eth.getBalance(accounts[1]));
        console.log(web3.eth.getBalance(accounts[2]));
        await crowdsaleInstance.buy({ from: accounts[1], value: web3.toWei('1', 'ether') });
        await crowdsaleInstance.buy({ from: accounts[2], value: web3.toWei('2', 'ether') });
        await timer(700);
        await crowdsaleInstance.finalize();
        try {
            await tokenInstance.loadProfit({ from: accounts[0], value: web3.toWei('0', 'ether') })
        } catch (error) {
            return assertJump(error);
        }
        assert.fail('should have thrown exception before');

    });
    it('Profits: Should be able to fetch profit', async function() {
        await tokenInstance.setMintAgent(crowdsaleInstance.address, true);
        await tokenInstance.setMintAgent(finalizeAgentInstance.address, true);
        await tokenInstance.setReleaseAgent(finalizeAgentInstance.address);
        await tokenInstance.setTransferAgent(crowdsaleInstance.address, true);
        await crowdsaleInstance.setFinalizeAgent(finalizeAgentInstance.address);
        assert.equal(await crowdsaleInstance.isFinalizerSane(), true, "Finalizer not sane. Can't continue.");
        assert.equal(await crowdsaleInstance.isPricingSane(), true, "Pricing not sane. Can't continue.");
        await timer(500);
        console.log(web3.eth.getBalance(accounts[1]));
        console.log(web3.eth.getBalance(accounts[2]));
        await crowdsaleInstance.buy({ from: accounts[1], value: web3.toWei('2', 'ether') });
        await crowdsaleInstance.buy({ from: accounts[2], value: web3.toWei('1', 'ether') });
        await crowdsaleInstance.buy({ from: accounts[3], value: web3.toWei('8', 'ether') });    
        await timer(700);
        await crowdsaleInstance.finalize();

        await tokenInstance.loadProfit({ from: accounts[0], value: web3.toWei('10', 'ether') })
        var userBalance = await web3.eth.getBalance(accounts[1]);
    
        await tokenInstance.fetchProfit({from: accounts[1]});
        var updatedBalance = await web3.eth.getBalance(accounts[1]);
        assert.equal(updatedBalance > userBalance, true,"Balance is not updated");

    
    });
    it('Profits: Same address should not be able to fetch profit multiple times', async function() {
        await tokenInstance.setMintAgent(crowdsaleInstance.address, true);
        await tokenInstance.setMintAgent(finalizeAgentInstance.address, true);
        await tokenInstance.setReleaseAgent(finalizeAgentInstance.address);
        await tokenInstance.setTransferAgent(crowdsaleInstance.address, true);
        await crowdsaleInstance.setFinalizeAgent(finalizeAgentInstance.address);
        assert.equal(await crowdsaleInstance.isFinalizerSane(), true, "Finalizer not sane. Can't continue.");
        assert.equal(await crowdsaleInstance.isPricingSane(), true, "Pricing not sane. Can't continue.");
        await timer(500);
        console.log(web3.eth.getBalance(accounts[1]));
        console.log(web3.eth.getBalance(accounts[2]));
        await crowdsaleInstance.buy({ from: accounts[1], value: web3.toWei('1', 'ether') });
        await crowdsaleInstance.buy({ from: accounts[3], value: web3.toWei('2', 'ether') });    
        await timer(700);
        await crowdsaleInstance.finalize();
        await tokenInstance.loadProfit({ from: accounts[0], value: web3.toWei('2', 'ether') })
        await tokenInstance.fetchProfit({ from: accounts[1] });
        try{
        await tokenInstance.fetchProfit({ from: accounts[1] });
        } catch (error) {
            return assertJump(error);
        }
    });


});