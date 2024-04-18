//imported necessary modules for working with gRPC
const path = require('path');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const readline = require('readline');

// Loading  the protobuf definition
const PROTO_PATH = path.join(__dirname, '..', 'proto', 'smart_home.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const smartHomeProto = grpc.loadPackageDefinition(packageDefinition).SmartHome;

// Created gRPC client
const client = new smartHomeProto('localhost:50051', grpc.credentials.createInsecure());

// Created readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// These functions to display menu and prompt user for input
function askForOption() {
  console.log('╔══════════════════════════════╗');
  console.log('║ Welcome To Smart Home System ║');
  console.log('╠══════════════════════════════╣');
  console.log('║ Please, Choose an option:    ║');
  console.log('╠══════════════════════════════╣');
  console.log('║ 1. Turn on the lights        ║');
  console.log('║ 2. Turn off the lights       ║');
  console.log('║ 3. Increase thermostat temp. ║');
  console.log('║ 4. Decrease thermostat temp. ║');
  console.log('║ 5. Open the curtains         ║');
  console.log('║ 6. Close the curtains        ║');
  console.log('╠══════════════════════════════╣');
  console.log('║ 9. Exit                      ║');
  console.log('╚══════════════════════════════╝');
  console.log('--------------------------------');
 
  //Please choose an option to take action
  rl.question('Enter your choice: ', (option) => {
    switch (option) {
      case '1':
        turnOnLights();
        break;
      case '2':
        turnOffLights();
        break;
      case '3':
        increaseTemperature();
        break;
      case '4':
        decreaseTemperature();
        break;
      case '5':
        openCurtains();
        break;
      case '6':
        closeCurtains();
        break;
      case '9':
        rl.close(); // Close the readline interface to exit
        process.exit(0); // Exit the program gracefully
        break;
      default:
        console.log('Invalid option');
        askForOption(); // Ask for option again if invalid input
    }
  });
}

// Functions to interact with gRPC server based on user input
function turnOnLights() {
  client.TurnOnLights({}, (err, response) => {
    if (err) {
      console.error('Error:', err);
    } else {
      console.log(response.message);
      askForOption();
    }
  });
}

function turnOffLights() {
  client.TurnOffLights({}, (err, response) => {
    if (err) {
      console.error('Error:', err);
    } else {
      console.log(response.message);
      askForOption();
    }
  });
}

function increaseTemperature() {
  client.IncreaseTemperature({}, (err, response) => {
    if (err) {
      console.error('Error:', err);
    } else {
      console.log(response.message);
      askForOption();
    }
  });
}

function decreaseTemperature() {
  client.DecreaseTemperature({}, (err, response) => {
    if (err) {
      console.error('Error:', err);
    } else {
      console.log(response.message);
      askForOption();
    }
  });
}

function openCurtains() {
  client.OpenCurtains({}, (err, response) => {
    if (err) {
      console.error('Error:', err);
    } else {
      console.log(response.message);
      askForOption();
    }
  });
}

function closeCurtains() {
  client.CloseCurtains({}, (err, response) => {
    if (err) {
      console.error('Error:', err);
    } else {
      console.log(response.message);
      askForOption();
    }
  });
}

// Start by displaying the menu and prompting for user input
askForOption();
