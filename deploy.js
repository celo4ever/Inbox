const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const { abi, bytecode } = require("./compile");

//Create the provider with:
//12 word key and link of the network (in this case the API)
const provider = new HDWalletProvider(
  'road tumble exotic funny firm ethics cup laugh achieve curtain vague slab'
  ,'https://rinkeby.infura.io/v3/c8655b0a52e845a78eeabc1e3c88dc8c'
);

//Instance of web to interact with the network throug provider
const web3 = new Web3(provider);

//We make it this way to avoid using promise
const deploy = async () => {
  const accounts = await web3.eth.getAccounts(); //accesint all accounts of the mnonic 12 word

  console.log('Attemping to deploy from account', accounts[0]);

  const result = await new web3.eth.Contract(abi) //Teaches web3 about what methods an Inbox contract has via an interface
    .deploy({ data: bytecode }) //Tells web3 that we want to deplow a new copy of this contract. It creates an OBJECT
    .send({ from: accounts[0], gas: "1000000" }); //Instructs web3 to send out a transaction that creates this contract

  console.log('Contract deployed to: ', result.options.address);
};
deploy();
