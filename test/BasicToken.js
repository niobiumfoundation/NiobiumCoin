const assertJump = require('./helpers/assertJump');

//var SafeMathLib = artifacts.require("../contracts/SafeMathLib.sol");

var BasicTokenMock = artifacts.require("./helpers/BasicTokenMock.sol");


contract('BasicToken', function(accounts) {
    let token;

    before(async function() {
        token = await BasicTokenMock.new(accounts[0], 100);
    });

    it("should return the correct totalSupply after construction", async function() {
        let totalSupply = await token.totalSupply();

        assert.equal(totalSupply, 100);
    });

    it("should return correct balances after transfer", async function() {
        let transfer = await token.transfer(accounts[1], 100);

        let firstAccountBalance = await token.balanceOf(accounts[0]);
        assert.equal(firstAccountBalance, 0);

        let secondAccountBalance = await token.balanceOf(accounts[1]);
        assert.equal(secondAccountBalance, 100);
    });


    it("should throw an error when trying to transfer more than balance", async function() {
        let status = await token.transfer.call(accounts[1], 101);
        assert.equal(status, false);
    });

});