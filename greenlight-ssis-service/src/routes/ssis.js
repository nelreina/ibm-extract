const express = require('express');

const api = express.Router();

module.exports = (ssis, logger) => {
  //   const { SSIS } = models;
  logger.info('Initialize SSIS project');
  ssis.init();

  api.get('/env', (req, res) => {
    try {
      res.send(ssis.getEnvVariables());
    } catch (error) {
      logger.error(error);
      res.status(503).send(error);
    }
  });
  api.post('/env', async (req, res) => {
    try {
      const response = await ssis.saveEnvVariables(req.body);
      res.send(response);
    } catch (error) {
      logger.error(error);
      res.status(503).send(error);
    }
  });
  api.get('/execution/status', (req, res) => {
    res.send(ssis.getExecutionStatus());
  });
  api.get('/execution/history', async (req, res) => {
    try {
      const response = await ssis.getExecutionHistory();
      res.send(response);
    } catch (error) {
      const { code, name, message } = error;
      logger.error({ code, name, message });
      res.status(503).send({ code, name, message });
    }
  });
  api.get('/execution/errors/:id', async (req, res) => {
    try {
      const response = await ssis.getEventErrors(req.params.id);
      res.send(response);
    } catch (error) {
      const { code, name, message } = error;
      logger.error({ code, name, message });
      res.status(503).send({ code, name, message });
    }
  });
  api.post('/execution/hook', (req, res) => {
    logger.info(JSON.stringify(req.body));
    res.send('Message Recieved!');
  });
  api.post('/execution/:pck', async (req, res) => {
    try {
      const response = await ssis.execute(req.params.pck);
      res.send(response);
    } catch (error) {
      const { code, name, message } = error;
      logger.error({ code, name, message });
      res.status(503).send({ code, name, message });
    }
  });

  return api;
};
