const { Service } = require('node-windows');
const { name, version, description, main } = require('./package.json');
// Create a new service object
const serviceName = `${name} Version: ${version}`;
const svc = new Service({
    name: serviceName,
    description: description,
    script: `${__dirname}\\${main}`,
    directory: __dirname,
    path: __dirname,
    env: {
        name: "NODE_ENV",
        value: "production"
    }
});

// Listen for the "install" event, which indicates the
// process is available as a service.

svc.on('install', function () {
    svc.start();
    console.log(`${serviceName} is installed and started!`);
});

svc.install();