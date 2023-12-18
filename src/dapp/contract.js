import FlightSuretyApp from '../../build/contracts/FlightSuretyApp.json';
import FlightSuretyData from '../../build/contracts/FlightSuretyData.json';
import Config from './config.json';
import Web3 from 'web3';

export default class Contract {
    constructor(network, callback) {

        let config = Config[network];
        this.web3 = new Web3(new Web3.providers.HttpProvider(config.url));
        this.flightSuretyApp = new this.web3.eth.Contract(FlightSuretyApp.abi, config.appAddress);
        this.flightSuretyData = new this.web3.eth.Contract(FlightSuretyData.abi, config.dataAddress);
        this.initialize(callback);
        this.owner = null;
        this.airlines = [];
        this.passengers = [];
    }

    initialize(callback) {
        this.web3.eth.getAccounts((error, accts) => {

            this.owner = accts[0];

            let counter = 1;

            while (this.airlines.length < 5) {
                this.airlines.push(accts[counter++]);
            }

            while (this.passengers.length < 5) {
                this.passengers.push(accts[counter++]);
            }

            callback();
        });
    }

    isOperational(callback) {
        let self = this;
        self.flightSuretyApp.methods
            .isOperational()
            .call({ from: self.owner }, callback);
    }

    //get airlines apurva
    getAirlines(callback) {
        let self = this;
        try {
            var a = self.flightSuretyApp.methods
                .getAirlinesList()
                .call(callback);
        } catch (error) {
            console.log(error)
        }

    }


    fetchFlightStatus(flight, callback) {
        let self = this;
        let payload = {
            airline: self.airlines[0],
            flight: flight,
            timestamp: Math.floor(Date.now() / 1000)
        }
        self.flightSuretyApp.methods
            .fetchFlightStatus(payload.airline, payload.flight, payload.timestamp)
            .send({ from: self.owner }, (error, result) => {
                callback(error, payload);
            });
    }

    //register airline
    airlineRegister(airlineName, airlineAddress, senderAddress, callback) {
        let self = this;
        let payload = {
            airlineName: airlineName,
            airlineAddress: airlineAddress,
            senderAddress: senderAddress,
        }
        self.flightSuretyApp.methods
            .registerAirline(payload.airlineName, payload.airlineAddress, payload.senderAddress)
            .send({ from: senderAddress, gas: 1000000 }, (error, result) => {
                if (error) {
                    console.log("EERROR FROM CALLBACK")
                    callback(error, payload);
                } else {
                    console.log("NO ERROR YET")
                    callback(error, payload);
                }
            });

    }

    //purchase insurance
    purchaseInsurance(flightName, passengerAddress, amount, callback) {
        let self = this;
        let payload = {
            flightName: flightName,
            passengerAddress: passengerAddress,
            amount: this.web3.utils.toWei(amount.toString(), "ether")
        }
        self.flightSuretyData.methods
            .buy(payload.flightName, payload.passengerAddress, payload.amount)
            .send({ from: payload.passengerAddress, value: this.web3.utils.toWei(amount.toString(), "ether"), gas: 1000000 }, (error, result) => {
                if (error) {
                    console.log("EERROR FROM purchaseInsurance CALLBACK")
                    callback(error, payload);
                } else {
                    console.log("NO ERROR FROM purchaseInsurance ")
                    callback(error, payload);
                }
            });

    }

    //fundAirline
    fundAirline(airlineAddress, fundAmount, callback) {
        console.log(" fund aDDRESS :: " + airlineAddress)
        console.log(" fund fundAmount :: " + fundAmount)
        let self = this;
        let payload = {
            airlineAddress: airlineAddress,
            fundAmount: this.web3.utils.toWei(fundAmount.toString(), "ether"),
        }
        if (Number(fundAmount) < 10) {

            try {
                throw new Error("MIN 10 ETH required for funding airline");
            } catch (error) {
                callback(error, null); // Pass the error to the callback
                return; // Terminate the function execution after throwing the error
            }

        }
        self.flightSuretyData.methods
            .fund(airlineAddress)
            .send({ from: airlineAddress, value: this.web3.utils.toWei(fundAmount.toString(), "ether"), gas: 1000000 }, (error, result) => {
                if (error) {
                    console.log("EERROR FROM FUND CALLBACK")
                    callback(error, payload);
                } else {
                    let val = this.web3.utils.toWei(fundAmount.toString(), "ether");
                    self.flightSuretyData.methods
                        .setAirlineFunded(airlineAddress, val).call((error, result) => {
                            console.log("isAirlineFunded   " + result)
                        });
                    console.log("NO ERROR FROM FUND")
                    callback(result, payload);
                }
            });


    }

}