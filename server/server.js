const path = require('path');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const PROTO_PATH = path.join(__dirname, '../proto/smart_home.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const smartHomeProto = grpc.loadPackageDefinition(packageDefinition);

// Simulated device states
let lightsState = false;
let thermostatTemperature = 18; // Default temperature for thermostat
let curtainsState = false;

// Define gRPC service functions
function turnOnLights(call, callback) {
    lightsState = true;
    callback(null, { message: 'Lights turned on' });
}

function turnOffLights(call, callback) {
    lightsState = false;
    callback(null, { message: 'Lights turned off' });
}

function increaseTemperature(call, callback) {
    thermostatTemperature++;
    callback(null, { message: `Temperature increased to ${thermostatTemperature}` });
}

function decreaseTemperature(call, callback) {
    thermostatTemperature--;
    callback(null, { message: `Temperature decreased to ${thermostatTemperature}` });
}

function openCurtains(call, callback) {
    curtainsState = true;
    callback(null, { message: 'Curtains opened' });
}

function closeCurtains(call, callback) {
    curtainsState = false;
    callback(null, { message: 'Curtains closed' });
}

// Create gRPC server
const server = new grpc.Server();
server.addService(smartHomeProto.SmartHome.service, {
    TurnOnLights: turnOnLights,
    TurnOffLights: turnOffLights,
    IncreaseTemperature: increaseTemperature,
    DecreaseTemperature: decreaseTemperature,
    OpenCurtains: openCurtains,
    CloseCurtains: closeCurtains,
});

// Bind the server to the specified address and port
server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err) {
        console.error('Error starting server:', err);
        return;
    }
    server.start();
    console.log(`Server running at http://0.0.0.0:${port}`);
});
