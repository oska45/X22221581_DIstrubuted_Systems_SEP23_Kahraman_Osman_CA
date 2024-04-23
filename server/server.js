
//------------------OKahramanDistrubutedSystems-----------------------------------//

//imported necessary modules for working with gRPC
const path = require('path');   //file and directory paths
const grpc = require('@grpc/grpc-js');   //gRPC library for Node.js
const protoLoader = require('@grpc/proto-loader'); //helps to load Protocol Buffer (protobuf) definitions


//// Loaded the protobuf definition
const PROTO_PATH = path.join(__dirname, '../proto/smart_home.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const smartHomeProto = grpc.loadPackageDefinition(packageDefinition);


//---------------------------------------------------------------------------//

// Simulated device states
let lightsState = false;
let thermostatTemperature = 18; // Default temperature for thermostat
let curtainsState = false;


//---------------------------------------------------------------------------//

// Switch statement to update device states based on received requests
function updateDeviceState(request) {
    switch (request.message) {
      case 'TurnOnLights':
        lightsState = true;
        return 'Lights turned on';
      case 'TurnOffLights':
        lightsState = false;
        return 'Lights turned off';
      case 'IncreaseTemperature':
        thermostatTemperature++;
        return `Thermostat temperature increased to : ${thermostatTemperature}`;
      case 'DecreaseTemperature':
        thermostatTemperature--;
        return `Thermostat temperature decreased to : ${thermostatTemperature}`;
      case 'OpenCurtains':
        curtainsState = true;
        return 'Curtains opened';
      case 'CloseCurtains':
        curtainsState = false;
        return 'Curtains closed';
      default:
        console.warn('Unexpected request:', request.message);
        return 'Invalid request';
    }
  }
  
//---------------------------------------------------------------------------//

   // Event handlers for data, end, and error events on the call
  function updateSmartHomeState(call) {
    call.on('data', (request) => {
      const responseMessage = updateDeviceState(request);
      console.log('Client message:', request.message); // Log received message
      call.write({ message: responseMessage });
    });
  
    call.on('end', () => {
      call.end();
    });
  
    call.on('error', (err) => {
      console.error('Error:', err);
    });
  }
  

//---------------------------------------------------------------------------//

  //creates a new gRPC server instance and adds the UpdateSmartHomeState method to it.
  const server = new grpc.Server();
  server.addService(smartHomeProto.SmartHome.service, {
    UpdateSmartHomeState: updateSmartHomeState,
  });
  

//---------------------------------------------------------------------------//

  //// Handling binding errors and starting the server
  server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err) {
      console.error('Error starting server:', err);
      return;
    }
    server.start();
    console.log(`Server running at http://0.0.0.0:${port}`);
  });

  //----------------------------------END-----------------------------------------//