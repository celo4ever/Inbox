//Modules
const assert = require('assert') //per fer assertions
const ganache = require('ganache-cli'); //local eth network
const Web3 = require('web3'); //constructor function (or class), to create instances of web3 library
const web3 = new Web3(ganache.provider());
const {
  abi,
  bytecode
} = require("../compile");

let lottery;
let acounts;

beforeEach(async () => {
  // Get a list of all accounts via async call
  accounts = await web3.eth.getAccounts();

  //Use one of those accounts to deploy
  //de contract
  //LOTTERY is the java representation of the contract. Now we can use it to acces methods and interact with it with js
  lottery = await new web3.eth.Contract(abi) //Teaches web3 about what methods an Inbox contract has via an interface
    .deploy({
      data: bytecode
    }) //Tells web3 that we want to deplow a new copy of this contract. It creates an OBJECT
    .send({
      from: accounts[0],
      gas: "1000000"
    }); //Instructs web3 to send out a transaction that creates this contract

});

describe('Contract lottery', () => {
  it('deploys a contract', () => {
    assert.ok(lottery.options.address);
  });

  it('allows one account to enter', async () => {
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei('0.02', 'ether')
    });

    const players = await lottery.methods.getPlayers().call({
      from: accounts[0]
    });

    assert.strictEqual(accounts[0], players[0]);
    assert.strictEqual(1, players.length);
  });

  it('allows multiple accounts to enter', async () => {
    const multiAccounts = accounts.slice(0, 3);

    for (let i = 0; i < multiAccounts.length; i++) {
      await lottery.methods.enter().send({
        from: accounts[i],
        value: web3.utils.toWei('0.02', 'ether')
      });
    }

    const players = await lottery.methods.getPlayers().call({
      from: accounts[0]
    });

    for (let i = 0; i < multiAccounts.length; i++) {
      assert.strictEqual(accounts[i], players[i]);
    }

    assert.strictEqual(3, players.length);
  });

  it('requires minimum amount eth', async () => {
    try {
      await lottery.methods.enter().send({
        from: accounts[0],
        value: '200'
      });
      assert(false); //fails test forced
    } catch (err) {
      assert(err);
    }
  });

  it('only manager can pick winner', async () => {
    try {
      await lottery.methods.pickWinner().send({
        from: accounts[1]
      });
      assert(false); //fails test forced
    } catch (err) {
      assert(err);
    }
  });

  it('sends money to the winner and reset players array', async () => {
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei('2', 'ether')
    });

    const initialBalance = await web3.eth.getBalance(accounts[0]);

    await lottery.methods.pickWinner().send({
      from: accounts[0]
    });

    const finalBalance = await web3.eth.getBalance(accounts[0]);

    const difference = finalBalance - initialBalance;
    console.log(difference);
    assert(difference > web3.utils.toWei('1.8', 'ether'));
  })
});
