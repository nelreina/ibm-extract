const fs = require('fs');
const path = require('path');

module.exports = (app, models, logger) => {
  logger.info('Importing routes...');
  fs
    .readdirSync(__dirname)
    .filter(function(file) {
      return file.indexOf('.') !== 0 && file !== 'index.js';
    })
    .forEach(function(file) {
      const routepath = file.replace('.js', '');
      logger.info(`route: /api/${routepath}/*`);
      app.use(
        `/api/${routepath}`,
        require(path.join(__dirname, file))(models, logger)
      );
    });
};
