const path = require('path');  //file and directory paths
const grpc = require('@grpc/grpc-js'); //gRPC library for Node.js
const protoLoader = require('@grpc/proto-loader');  //helps to load Protocol Buffer (protobuf) definitions
const readline = require('readline'); //an interface for reading input from a readable stream

/// Loaded the protobuf definition
const PROTO_PATH = path.join(__dirname, '..', 'proto', 'smart_home.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const smartHomeProto = grpc.loadPackageDefinition(packageDefinition).SmartHome; //extracts the SmartHome object from the loaded protobuf


/*
CLIENT
npm install @grpc/grpc-js
npm install @grpc/proto-loader
npm install readline-sync
*/

//---------------------------------------------------------------------------//

// Created gRPC client
const client = new smartHomeProto('localhost:50051', grpc.credentials.createInsecure());

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


//---------------------------------------------------------------------------//

//menu of options for controlling a smart home system
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
  console.log('║ 5. Open the curtains        ║');
  console.log('║ 6. Close the curtains        ║');
  console.log('╠══════════════════════════════╣');
  console.log('║ 9. Exit                      ║');
  console.log('╚══════════════════════════════╝');
  console.log('--------------------------------');

  rl.question('Enter your choice: ', (option) => {
    switch (option) {   //switch statement
      case '1':
        sendMessage('TurnOnLights');
        break;
      case '2':
        sendMessage('TurnOffLights');
        break;
      case '3':
        sendMessage('IncreaseTemperature');
        break;
      case '4':
        sendMessage('DecreaseTemperature');
        break;
      case '5':
        sendMessage('OpenCurtains');
        break;
      case '6':
        sendMessage('CloseCurtains');
        break;
      case '9':
        rl.close();
        process.exit(0);
        break;
      default:
        console.log('Invalid option');
    }

    askForOption();
  });
}

function sendMessage(message) {
  const call = client.UpdateSmartHomeState();

  // Send request message
  call.write({ message });

  // Handle server responses
  call.on('data', (response) => {
    console.log('Server response:', response.message);
  });

  call.on('end', () => {
    console.log('Server call ended.');
  });

  call.on('error', (err) => {
    console.error('Error:', err);
  });
}

// Start user interaction
askForOption();