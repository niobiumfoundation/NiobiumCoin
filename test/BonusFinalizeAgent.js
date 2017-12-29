'use strict';

const assertJump = require('./helpers/assertJump');
var Token = artifacts.require("./helpers/MintableTokenMock.sol");
var bonusContract = artifacts.require("../contracts/BonusFinalizeAgent.sol");

function etherInWei(x) {
    return web3.toBigNumber(web3.toWei(x, 'ether')).toNumber();
}


function tokenPriceInWeiFromTokensPerEther(x) {
    if (x == 0) return 0;
    return Math.floor(web3.toWei(1, 'ether') / x);
}

function tokenInSmallestUnit(tokens, _tokenDecimals) {
    return tokens * Math.pow(10, _tokenDecimals);
}

contract('BonusFinalizeAgent', function(accounts) {
    var _teamBonusPoints = [200, 200, 200];
    var _teamAddresses = [accounts[0], accounts[1], accounts[2]];


    var _tokenName = "TOSHCOIN";
    var _tokenSymbol = "TCO";
    var _tokenDecimals = 8;
    var _tokenInitialSupply = 100000000 * Math.pow(10, _tokenDecimals);
    var _tokenMintable = true;
    var decimals = _tokenDecimals;
    var mintableToken = null;
    var bonusAgent = null;

    beforeEach(async() => {
        mintableToken = await Token.new(_tokenName, _tokenSymbol, _tokenInitialSupply, _tokenDecimals, _tokenMintable, { from: accounts[0] });
        bonusAgent = await bonusContract.new(mintableToken.address, accounts[5], _teamBonusPoints, _teamAddresses);
    });

    it('Creation: BonusFinalizeAgent must be able to initialized properly.', async function() {
        assert.equal(await bonusAgent.token.call(), mintableToken.address);
        assert.equal(await bonusAgent.crowdsale.call(), accounts[5]);
        assert.equal(await bonusAgent.teamAddresses.call(0), accounts[0]);
        assert.equal(await bonusAgent.teamAddresses.call(1), accounts[1]);
        assert.equal(await bonusAgent.teamAddresses.call(2), accounts[2]);

    });

    it('Creation: Bonus totalMembers count must be able to initialized properly.', async function() {
        let bonusAgent2 = await bonusContract.new(mintableToken.address, accounts[5], [200, 300, 200, 300, 500], [accounts[0], accounts[1], accounts[2], accounts[3], accounts[4]]);
        assert.equal(await bonusAgent2.totalMembers.call(), 5);
    });

    it('Creation: Irregular initialization must fail.', async function() {
        try {
            bonusAgent2 = await bonusContract.new(mintableToken.address, accounts[5], [200, 300, 200, 300], [accounts[0], accounts[1], accounts[2], accounts[3], accounts[4]]);
        } catch (error) {
            return assertJump(error);
        }
        assert.fail('should have thrown exception before');
    });


});