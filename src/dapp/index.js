
import DOM from './dom';
import Contract from './contract';
import './flightsurety.css';


(async () => {

    let result = null;

    let contract = new Contract('localhost', () => {

        // Read transaction
        contract.isOperational((error, result) => {
            console.log(error, result);
            display('Operational Status', 'Check if contract is operational', [{ label: 'Operational Status', error: error, value: result }]);
        });

        // get first airline
        contract.getAirlines((error, result) => {
            console.log(error, result);
            display('Registered airlines on startup', 'registered airlines list', [{ label: 'Already registered airlines', error: error, value: result }]);
        });



        DOM.elid('registered-airlines').addEventListener('click', () => {
            // get first airline
            contract.getAirlines((error, result) => {
                console.log(error, result);
                display('Registered airlines so far', 'registered airlines list', [{ label: 'Already registered airlines', error: error, value: result }]);
            });
        })


        //fund airline
        DOM.elid('fund-airline').addEventListener('click', () => {
            // fund airline
            let fundVal = DOM.elid('from-fund-amount').value;
            let address = DOM.elid('from-fund-address').value;

            contract.fundAirline(address, fundVal, (error, result) => {

                if (result == false) {
                    display('Funded FALSE', 'funding FALSE', [{ label: 'funding Status', error: error, value: result }]);
                }
                if (error) {
                    display('Funded Status', 'funding failed', [{ label: 'funding Status', error: error, value: result }]);
                }
                if (result)
                    display('Funded Status', 'funding success', [{ label: 'funding Status', error: error, value: result }]);

            });

        })

        //purchase insurance
        DOM.elid('buy-insurance').addEventListener('click', () => {

            let flightName = DOM.elid('flight-name').value;
            let passengerAddress = DOM.elid('passenger-address').value;
            let amount = DOM.elid('insurance-amount').value;

            console.log("flightName  :" + flightName);
            console.log("passengerAddress  :" + passengerAddress);
            console.log("amount  :" + amount);

            contract.purchaseInsurance(flightName, passengerAddress, amount, (error, result) => {
                display('Purchase Insurance', 'Purchasing Insurance', [{ label: 'Purchase Insurance Response', error: error, value: result }]);
            });

        })

        // User-submitted transaction
        DOM.elid('submit-oracle').addEventListener('click', () => {
            let flight = DOM.elid('flight-number').value;
            // Write transaction
            contract.fetchFlightStatus(flight, (error, result) => {
                display('Oracles', 'Trigger oracles', [{ label: 'Fetch Flight Status', error: error, value: result.flight + ' ' + result.timestamp }]);
            });
        })


        // airline register
        DOM.elid('airline-register').addEventListener('click', () => {
            console.log("CLIEKCEDs")
            let airlineName = DOM.elid('airline-name').value;
            let airlineAddress = DOM.elid('airline-address').value;
            let senderAddress = DOM.elid('sender-address').value;

            contract.airlineRegister(airlineName, airlineAddress, senderAddress, (error, result) => {
                display('Airline ', 'Register airline', [{ label: 'Airline reg', error: error, value: result }]);
            });
            console.log("CLIEKCED")
        })

        // airline/flight status
        DOM.elid('get-status').addEventListener('click', async () => {
            let flightName = DOM.elid('flight-status-name').value;
            console.log("FLIGHT BAME " + flightName)
            var res = await fetch('http://localhost:3000/api/status/' + flightName)
            displayV2('Airline Status', 'airline status call', await res.json());
        })
    });
})();


function displayV2(title, description, results) {
    let displayDiv = DOM.elid("display-wrapper");
    let section = DOM.section();
    section.appendChild(DOM.h2(title));
    section.appendChild(DOM.h5(description));
    let row = section.appendChild(DOM.div({ className: 'row' }));
    row.appendChild(DOM.div({ className: 'col-sm-8 field-value' }, String(JSON.stringify(results))));
    section.appendChild(row);
    displayDiv.append(section);

}


function display(title, description, results) {
    let displayDiv = DOM.elid("display-wrapper");
    let section = DOM.section();
    section.appendChild(DOM.h2(title));
    section.appendChild(DOM.h5(description));
    results.map((result) => {
        let row = section.appendChild(DOM.div({ className: 'row' }));
        row.appendChild(DOM.div({ className: 'col-sm-4 field' }, result.label));
        row.appendChild(DOM.div({ className: 'col-sm-8 field-value' }, result.error ? String(result.error) : String(JSON.stringify(result.value))));
        section.appendChild(row);
    })
    displayDiv.append(section);

}







