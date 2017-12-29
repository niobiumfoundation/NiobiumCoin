var Web3 = require('web3');
var postmark = require("postmark");
const util = require('ethereumjs-util');

if (typeof web3 !== 'undefined') {
    web3 = new Web3(web3.currentProvider);
} else {
    // set the provider you want from Web3.providers
    web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
}

var client = new postmark.Client("4793c914-d0a6-4951-8d09-93613397558d");

if (web3.isConnected()) {
    console.log("connected");
} else {
    console.log("not connected")
}

var crowdsaleABI = [{ "constant": true, "inputs": [], "name": "ownerTestValue", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "requireCustomerId", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "addr", "type": "address" }], "name": "invest", "outputs": [], "payable": true, "type": "function" }, { "constant": true, "inputs": [], "name": "isPricingSane", "outputs": [{ "name": "sane", "type": "bool" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "endsAt", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "minimumFundingGoal", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "getState", "outputs": [{ "name": "", "type": "uint8" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "addr", "type": "address" }], "name": "setFinalizeAgent", "outputs": [], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "addr", "type": "address" }, { "name": "customerId", "type": "uint128" }, { "name": "v", "type": "uint8" }, { "name": "r", "type": "bytes32" }, { "name": "s", "type": "bytes32" }], "name": "investWithSignedAddress", "outputs": [], "payable": true, "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }], "name": "investedAmountOf", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "finalizeAgent", "outputs": [{ "name": "", "type": "address" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "receiver", "type": "address" }, { "name": "fullTokens", "type": "uint256" }, { "name": "weiPrice", "type": "uint256" }], "name": "preallocate", "outputs": [], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "maximumSellableTokens", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "weiRaised", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "isCrowdsale", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [], "name": "finalize", "outputs": [], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "_pricingStrategy", "type": "address" }], "name": "setPricingStrategy", "outputs": [], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "tokensSold", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [], "name": "refund", "outputs": [], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "signerAddress", "outputs": [{ "name": "", "type": "address" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "weiRefunded", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [], "name": "halt", "outputs": [], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "time", "type": "uint256" }], "name": "setEndsAt", "outputs": [], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "pricingStrategy", "outputs": [{ "name": "", "type": "address" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "loadedRefund", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "isMinimumGoalReached", "outputs": [{ "name": "reached", "type": "bool" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "value", "type": "bool" }], "name": "setRequireCustomerId", "outputs": [], "payable": false, "type": "function" }, { "constant": false, "inputs": [], "name": "loadRefund", "outputs": [], "payable": true, "type": "function" }, { "constant": false, "inputs": [{ "name": "val", "type": "uint256" }], "name": "setOwnerTestValue", "outputs": [], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [{ "name": "", "type": "address" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "multisigWallet", "outputs": [{ "name": "", "type": "address" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }], "name": "tokenAmountOf", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "customerId", "type": "uint128" }], "name": "buyWithCustomerId", "outputs": [], "payable": true, "type": "function" }, { "constant": true, "inputs": [{ "name": "weiAmount", "type": "uint256" }, { "name": "tokenAmount", "type": "uint256" }, { "name": "weiRaisedTotal", "type": "uint256" }, { "name": "tokensSoldTotal", "type": "uint256" }], "name": "isBreakingCap", "outputs": [{ "name": "limitBroken", "type": "bool" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [], "name": "buy", "outputs": [], "payable": true, "type": "function" }, { "constant": true, "inputs": [], "name": "isFinalizerSane", "outputs": [{ "name": "sane", "type": "bool" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "startsAt", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "finalized", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "halted", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }], "name": "earlyParticipantWhitelist", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [], "name": "unhalt", "outputs": [], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "requiredSignedAddress", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "isCrowdsaleFull", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "investorCount", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "addr", "type": "address" }, { "name": "status", "type": "bool" }], "name": "setEarlyParicipantWhitelist", "outputs": [], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "value", "type": "bool" }, { "name": "_signerAddress", "type": "address" }], "name": "setRequireSignedAddress", "outputs": [], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "addr", "type": "address" }, { "name": "customerId", "type": "uint128" }], "name": "investWithCustomerId", "outputs": [], "payable": true, "type": "function" }, { "constant": false, "inputs": [{ "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "customerId", "type": "uint128" }, { "name": "v", "type": "uint8" }, { "name": "r", "type": "bytes32" }, { "name": "s", "type": "bytes32" }], "name": "buyWithSignedAddress", "outputs": [], "payable": true, "type": "function" }, { "constant": true, "inputs": [], "name": "token", "outputs": [{ "name": "", "type": "address" }], "payable": false, "type": "function" }, { "inputs": [{ "name": "_token", "type": "address" }, { "name": "_pricingStrategy", "type": "address" }, { "name": "_multisigWallet", "type": "address" }, { "name": "_start", "type": "uint256" }, { "name": "_end", "type": "uint256" }, { "name": "_minimumFundingGoal", "type": "uint256" }, { "name": "_maximumSellableTokens", "type": "uint256" }], "payable": false, "type": "constructor" }, { "payable": true, "type": "fallback" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "investor", "type": "address" }, { "indexed": false, "name": "weiAmount", "type": "uint256" }, { "indexed": false, "name": "tokenAmount", "type": "uint256" }, { "indexed": false, "name": "customerId", "type": "uint128" }], "name": "Invested", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "investor", "type": "address" }, { "indexed": false, "name": "weiAmount", "type": "uint256" }], "name": "Refund", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "requireCustomerId", "type": "bool" }, { "indexed": false, "name": "requiredSignedAddress", "type": "bool" }, { "indexed": false, "name": "signerAddress", "type": "address" }], "name": "InvestmentPolicyChanged", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "addr", "type": "address" }, { "indexed": false, "name": "status", "type": "bool" }], "name": "Whitelisted", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "endsAt", "type": "uint256" }], "name": "EndsAtChanged", "type": "event" }];
var crowdsaleAddress = '0x6ae6fDCC1714A2d2749Fc4e957Aa1155fdc6b09b';
var crowdsale = web3.eth.contract(crowdsaleABI).at(crowdsaleAddress);
var _tokenDecimals = 8;

var filter = web3.eth.filter({
    address: crowdsaleAddress
        // ,topics: [web3.sha3('Invested(address,uint,uint,uint128)')]
        // topics: ['0x0396f60aaad038749091d273dc13aaabc63db6e2271c7bad442d5cf25cc43350']
});

filter.watch(function(error, result) {
    // Arg[0]: 00000000000000000000000000568fa85228c66111e3181085df48681273cd77 <--- Address of investor
    // Arg[1]: 0000000000000000000000000000000000000000000000000de0b6b3a7640000 <--- Amount of wei invested. convert into ether
    // Arg[2]: 000000000000000000000000000000000000000000000000000000e8d4a51000 <--- Amount of Tokens received in smalled unit.
    // Arg[3]: 0000000000000000000000000000000000000000000000000000000000000009 <--- Customer ID
    var data = util.stripHexPrefix(result.data);
    var args = data.match(/.{1,64}/g);
    var receiverAddress = "0x" + args[0].substr(args[0].length - 40);
    var etherSpent = web3.fromWei(web3.toDecimal("0x" + util.unpad(args[1])), 'ether');
    var tokenReceived = web3.toDecimal("0x" + util.unpad(args[2])) / Math.pow(10, _tokenDecimals);
    var contributorId = web3.toDecimal("0x" + util.unpad(args[3]));
    var investorEmail = getCustomerEmailId(contributorId);

    console.log("Contributor Address is:", receiverAddress);
    console.log("Ether(s) Invested is:", etherSpent);
    console.log("FEED(s) Received is:", tokenReceived);
    console.log("Contributor ID is:", contributorId);
    console.log("Contributor Email is:", investorEmail);
    console.log("One investement Received. :)");
    console.log("Sending confirmation email.");

    client.sendEmailWithTemplate({
        "From": "hello@toshblocks.com",
        "To": investorEmail,
        "TemplateId": 2155541,
        "TemplateModel": {
            "token_name": "FEED",
            "token_receiver_address": receiverAddress,
            "ether_spent": etherSpent,
            "tokne_received": tokenReceived
        }
    });
    console.log("Email done!");
    console.log("================================\n\n");

    // To convert a number to 32 byte string
    // 3 to => '0x0000000000000000000000000000000000000000000000000000000000000003'
    // util.bufferToHex(util.setLengthLeft(3, 32))
});


function getCustomerEmailId(customerId) {
    // get your customer email id
    // from using the give customerId
    // hard coded for now for testing
    return "hi@toshendra.com";
}