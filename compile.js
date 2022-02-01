//Modules
const path = require('path'); //cross platform compatibility
const fs = require('fs'); //for reading
const solc = require('solc'); //compiler

const lotteryPath = path.resolve(__dirname, 'contracts', 'Lottery.sol'); //dirname = current working director
const source = fs.readFileSync(lotteryPath, 'utf8'); //read content of the file

/**
compile(source, number_of_contracts)
*/

let input = {
  language: "Solidity",
  sources: {
    [lotteryPath]: {
      content: source,
    },
  },

  settings: {
    outputSelection: {
      "*": {
        "*": ["*"],
      },
    },
  },
};

var output = JSON.parse(solc.compile(JSON.stringify(input)));

module.exports = {
  abi: output.contracts[[lotteryPath]]["Lottery"].abi, //to acces functions of a contract, .JS<> ABI <> network
  bytecode: output.contracts[[lotteryPath]]["Lottery"].evm.bytecode.object, //bytecode deployed in the network
};
