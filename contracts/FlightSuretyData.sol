pragma solidity ^0.4.25;


import "../node_modules/openzeppelin-solidity/contracts/math/SafeMath.sol";
import "./FlightSuretyApp.sol";

contract FlightSuretyData {
    using SafeMath for uint256;

    /********************************************************************************************/
    /*                                       DATA VARIABLES                                     */
    /********************************************************************************************/

    address private contractOwner;                                      // Account used to deploy contract
    bool private operational = true;                                    // Blocks all state changes throughout the contract if false
    struct airlineStruct {                                          
        string airlineName; 
        string customLogs;               
        address airlineId;
        bool isAirlineRegistered;
        bool isAirlineAuthorized;
        bool isAirlineoperationalToVote;    
        bool isAirlineFunded;                                                 
    }
    uint256 public numberOfAirlines = 0;

    mapping(address => airlineStruct) public airlineList;
    
    address[] public airlineAddresses;
    string public firstAddress;



    struct passengerStruct {                                          
        address passengerAddress; 
        string flight;   
        bool boughtInsurance;            
        uint256 insuranceAmount;                                                    
    }
    mapping(address => passengerStruct) private passengerList;
    

    /********************************************************************************************/
    /*                                       EVENT DEFINITIONS                                  */
    /********************************************************************************************/

        event RegisterAnAirline(address obj);
    /**
    * @dev Constructor
    *      The deploying account becomes contractOwner
    */
    constructor
                                (
                                ) 
                                public 
    {
        contractOwner = msg.sender;

                 airlineList[contractOwner] = airlineStruct({
                    airlineName: "First Default Airline",
                    customLogs: "default airline added in initilization",
                    airlineId: contractOwner,
                    isAirlineRegistered: true,
                    isAirlineAuthorized: true,
                    isAirlineoperationalToVote: true,
                    isAirlineFunded : false
                    });      
         airlineAddresses.push(contractOwner);    

        numberOfAirlines = numberOfAirlines.add(1);
        emit RegisterAnAirline(contractOwner);
    }

    /********************************************************************************************/
    /*                                       FUNCTION MODIFIERS                                 */
    /********************************************************************************************/

    // Modifiers help avoid duplication of code. They are typically used to validate something
    // before a function is allowed to be executed.

    /**
    * @dev Modifier that requires the "operational" boolean variable to be "true"
    *      This is used on all state changing functions to pause the contract in 
    *      the event there is an issue that needs to be fixed
    */
    modifier requireIsOperational() 
    {
        require(operational, "Contract is currently not operational");
        _;  // All modifiers require an "_" which indicates where the function body will be added
    }

    /**
    * @dev Modifier that requires the "ContractOwner" account to be the function caller
    */
    modifier requireContractOwner()
    {
        require(msg.sender == contractOwner, "Caller is not contract owner");
        _;
    }

    /********************************************************************************************/
    /*                                       UTILITY FUNCTIONS                                  */
    /********************************************************************************************/

    /**
    * @dev Get operating status of contract
    *
    * @return A bool that is the current operating status
    */      
    function isOperational() 
                            public 
                            view 
                            returns(bool) 
    {
        return operational;
    }

   function getAirlinesList() public view returns (address[]) {
        return airlineAddresses;
    }

    /**
    * @dev Sets contract operations on/off
    *
    * When operational mode is disabled, all write transactions except for this one will fail
    */    
    function setOperatingStatus
                            (
                                bool mode
                            ) 
                            external
                            requireContractOwner 
    {
        require(mode != operational, "mode should be different then existing mode");
        operational = mode;
    }

    /********************************************************************************************/
    /*                                     SMART CONTRACT FUNCTIONS                             */
    /********************************************************************************************/
   /**
    * @dev Add an airline to the registration queue
    *      Can only be called from FlightSuretyApp contract
    *
    */   
    function registerAirline
                            (   string registerAirlineName,
                                address registerAirlineAdderess,
                                address senderAddress
                            )
                            requireIsOperational
                            external
                            returns (bool)
                            
                            
    {

    //         struct airlineStruct {                                          
    //     string airlineName; 
    //     string customLogs;               
    //     address airlineId;
    //     bool isAirlineRegistered;
    //     bool isAirlineAuthorized;
    //     bool isAirlineoperationalToVote;                                                     
    // }


                //  airlineList[contractOwner] = airlineStruct({
                //     airlineName: "First Default Airline",
                //     customLogs: "default airline added in initilization",
                //     airlineId: contractOwner,
                //     isAirlineRegistered: true,
                //     isAirlineAuthorized: true,
                //     isAirlineoperationalToVote: true
                //     });
                
        bool isAlreadyRegistered = !airlineList[registerAirlineAdderess].isAirlineRegistered; 
        require(isAlreadyRegistered, "Already registered airline Apurva");

        if(numberOfAirlines < 5){

          bool isExistingAirlineIsSender = airlineList[senderAddress].isAirlineRegistered;
            
            require(isExistingAirlineIsSender, "Only Existing airline can add new ones"); 

          airlineList[registerAirlineAdderess] = airlineStruct({
                      airlineName: registerAirlineName,
                      customLogs: "nothing fishy going on",
                      airlineId: registerAirlineAdderess,
                      isAirlineRegistered: true,
                      isAirlineAuthorized: false,
                      isAirlineoperationalToVote: false,
                      isAirlineFunded : false
                      });

         airlineAddresses.push(registerAirlineAdderess);   

        numberOfAirlines = numberOfAirlines.add(1);
                
        emit RegisterAnAirline(registerAirlineAdderess);
        } else{
            require(votingProcess(registerAirlineAdderess), "Unable to get required voting");
        }

    return true;
    }

        function setAirlineFunded(address addres, uint256 amt ) returns (bool) {
        if(amt >= 10 ether){
            airlineList[addres].isAirlineFunded = true; 
        }
        return airlineList[addres].isAirlineFunded;
    }

    function votingProcess(address add) returns (bool) {
        return  true;
        // uint256 numberOfVotes = 0;

        // for (uint256 i = 0; i < airlineAddresses.length; i++) {
        //     if(airlineList[i].isAirlineoperationalToVote){
        //         numberOfVotes = numberOfVotes + 1;
        //     }
        // }
        // if(numberOfVotes < numberOfAirlines.div(2)){
        //     return true;
        // }
    }
    function isAirline(address inputAirlineAddress)public returns (bool)
    {
        if(airlineList[inputAirlineAddress].isAirlineRegistered){
            return true;
        }
        return false;
    }

   /**
    * @dev Buy insurance for a flight
    *
    */   
    function buy
                            (    
                               string flightName,
                               address passengerAddress,
                               uint256 amount

                            )
                            external
                            payable
    {
            
            uint256 amountInWei = 1000000000000000000;
            require(amount <= amountInWei, "Amount is more then required");


            bool insuranceAlreayExist = passengerList[passengerAddress].boughtInsurance;

            require(!insuranceAlreayExist, "Passenger already have insurance"); 

          passengerList[passengerAddress] = passengerStruct({
                      passengerAddress: passengerAddress,
                      flight: flightName,
                      boughtInsurance: true,
                      insuranceAmount: amount
                      });
 
    }

    /**
     *  @dev Credits payouts to insurees
    */
    function creditInsurees
                                (
                                )
                                external
                                pure
    {
    }
    

    /**
     *  @dev Transfers eligible payout funds to insuree
     *
    */
    function pay
                            (
                            )
                            external
                            pure
    {
    }

   /**
    * @dev Initial funding for the insurance. Unless there are too many delayed flights
    *      resulting in insurance payouts, the contract should be self-sustaining
    *
    */   
    function fund
                            (   
                                 address airline
                            )
                            public
                            payable
                            requireIsOperational
    {
        
    }

    function getFlightKey
                        (
                            address airline,
                            string memory flight,
                            uint256 timestamp
                        )
                        pure
                        internal
                        returns(bytes32) 
    {
        return keccak256(abi.encodePacked(airline, flight, timestamp));
    }

    /**
    * @dev Fallback function for funding smart contract.
    *
    */
    function() 
                            external 
                            payable 
    {
        fund(msg.sender);
    }


}

