var HDWalletProvider = require("truffle-hdwallet-provider");
var mnemonic = "candy maple cake sugar pudding cream honey rich smooth crumble sweet treat";
var NonceTrackerSubprovider = require("web3-provider-engine/subproviders/nonce-tracker")
module.exports = {
  networks: {
    development: {
      provider: function () {
        var wallet = new HDWalletProvider(mnemonic, "http://127.0.0.1:8545/", 0, 50)
        return wallet
      },
      network_id: '*'
    },
    sepolia: {      
      provider: function () {
        var wallet = new HDWalletProvider("mind change amazing evidence own athlete soda vivid exercise rigid tray innocent", 'https://sepolia.infura.io/v3/a9fa67bb1afa45baad0511c7ff635d58')
        var nonceTracker = new NonceTrackerSubprovider()
        wallet.engine._providers.unshift(nonceTracker)
        nonceTracker.setEngine(wallet.engine)
        return wallet
      },
      
      network_id: "11155111",
      gas: 4465030,
    }
  },
  compilers: {
    solc: {
      version: "^0.4.24"
    }
  }
};