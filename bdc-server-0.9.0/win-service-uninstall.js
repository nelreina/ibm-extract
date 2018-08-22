const { Service } = require('node-windows');

const { name, version, description, main } = require('./package.json');

// Create a new service object
const serviceName = `${name} Version: ${version}`;
const svc = new Service({
    name: serviceName,
    description: description,
    script: `${__dirname}\\${main}`
});


// Listen for the "uninstall" event so we know when it's done.
svc.on('uninstall', function () {
    console.log('Uninstall complete.');
    console.log('The service exists: ', svc.exists);
});

// Uninstall the service.
svc.uninstall();