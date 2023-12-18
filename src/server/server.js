import FlightSuretyApp from '../../build/contracts/FlightSuretyApp.json';
import Config from './config.json';
import Web3 from 'web3';
import express from 'express';


let config = Config['localhost'];
let web3 = new Web3(new Web3.providers.WebsocketProvider(config.url.replace('http', 'ws')));
web3.eth.defaultAccount = web3.eth.accounts[0];
let flightSuretyApp = new web3.eth.Contract(FlightSuretyApp.abi, config.appAddress);
let FEE = "1"
let oraclesArray = [];

flightSuretyApp.events.OracleRequest({
    fromBlock: 0
  }, function (error, event) {
    if (error) console.log(error)
    console.log(event)
});

const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // Allow any domain to access
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.get('/api', (req, res) => {
    res.send({
      message: 'An API for use with your Dapp!'
    })
})

app.get('/api/status/:flight', (req, res) => {
  const flight = req.params.flight;
  console.log("API CALLED")
  res.send({
    message: flight
  })
})


async function initilizeOracles() {
      let accounts = await web3.eth.getAccounts();
      for (let account of accounts.slice(accounts.length - 21, accounts.length)) {
          await flightSuretyApp.methods.registerOracle().send({
              value: web3.utils.toWei(FEE, "ether"),
              from: account,
              gas: 1000000
          });
          const result = await flightSuretyApp.methods
          .getMyIndexes().call({ from: account });
          console.log("Oracles  " + result);
          oraclesArray.push(result)
      }
}
initilizeOracles()


export default app;


