const { sqllize } = require('nelreina-node-utils');
const { find, isArray } = require('lodash');
const S = require('string');

const Q = require('./ssis-queries');

const { invokeSQLCmd } = sqllize;
const sensitiveValue = '*********';

// region Get Env Vars
const ssisFolder = process.env.SSIS_FOLDER;
const ssisEnv = process.env.SSIS_ENVIRONMENT;
const ssisProject = process.env.SSIS_PROJECT;
const ssisEnvId = process.env.SSIS_ENVIRONMENT_ID;
// endregion

// region Local Methods
const _executeSSIS = async (mssql, pck) => {
  return await invokeSQLCmd(
    mssql,
    `exec spExecSSIS '${ssisFolder}','${ssisProject}','${pck}.dtsx'`,
    true
  );
};
const _setEnvVariable = async (mssql, name, value) => {
  const expr = `EXEC [SSISDB].[catalog].[set_environment_variable_value] 
      @folder_name=N'${ssisFolder}', 
      @environment_name=N'${ssisEnv}', 
      @variable_name=N'${name}', 
      @value=N'${value}'`;
  await invokeSQLCmd(mssql, expr);
};
const _getExecutionStatus = async (mssql, executionId = null) => {
  const params = { ssisProject, executionId };
  return await invokeSQLCmd(
    mssql,
    S(Q.executionStatus).template(params).s,
    true
  );
};
const _getExecutionHistory = async (mssql, executionId = null) => {
  const params = { ssisProject, executionId };
  return await invokeSQLCmd(mssql, S(Q.executionStatus).template(params).s);
};
const _getEventErrors = async (mssql, executionId = null) => {
  const params = { executionId };
  return await invokeSQLCmd(mssql, S(Q.eventErrors).template(params).s);
};
const _isExecutionDone = exec => {
  switch (exec.status) {
    case 3:
    case 4:
    case 6:
    case 7:
    case 9:
      return true;

    default:
      return false;
  }
};
// endregion

class ProjectSSIS {
  constructor(connections, logger) {
    const { mssql } = connections;
    this._isExecuting = false;
    this._executionStatus = undefined;
    this._executionId = undefined;

    this._mssql = mssql;
    this._logger = logger;
    this._envVariables = [];
  }
  async init() {
    const envVarSql = `select * from [SSISDB].[catalog].[environment_variables] where environment_id = ${ssisEnvId}`;
    this._executionStatus = await _getExecutionStatus(this._mssql);
    const env = await invokeSQLCmd(this._mssql, envVarSql);
    if (isArray(env)) {
      this._envVariables = env.map(e => {
        if (e.sensitive) {
          e.value = sensitiveValue;
        }
        return e;
      });
    } else {
      this._logger.error(env);
    }
  }

  getEnvVariables() {
    return this._envVariables;
  }
  async saveEnvVariables(newEnvVar) {
    const keys = Object.keys(newEnvVar);
    const promises = [];
    keys.forEach(name => {
      const env = find(this._envVariables, { name });
      if (env) {
        const value = newEnvVar[name];
        if (env.value !== value) {
          this._logger.info(
            `Saving environment variable: ${name}=${
              env.sensitive ? '******' : value
            }`
          );

          promises.push(_setEnvVariable(this._mssql, name, value));
        }
      }
    });
    const ret = await Promise.all(promises);
    await this.init();
    return this._envVariables;
  }
  async execute(pck) {
    if (this._isExecuting) {
      return this._executionStatus;
    }
    // Start Execution
    const resp = await _executeSSIS(this._mssql, pck);
    this._executionId = resp && resp.execution_id;
    this._isExecuting = true;
    this.checkExecutionStatus(this._executionId);
    this._executionStatus = await _getExecutionStatus(
      this._mssql,
      this._executionId
    );
    return {
      isExecuting: this._isExecuting,
      executionStatus: this._executionStatus
    };
  }
  isExecuting() {
    return this._isExecuting;
  }
  checkExecutionStatus(executionId) {
    this._checking = setInterval(async () => {
      this._executionStatus = await _getExecutionStatus(
        this._mssql,
        executionId
      );
      this._logger.debug(JSON.stringify(this._executionStatus));
      if (_isExecutionDone(this._executionStatus)) {
        clearInterval(this._checking);
        this._isExecuting = false;
      }
    }, 5000);
    return true;
  }
  async getExecutionHistory() {
    return await _getExecutionHistory(this._mssql);
  }
  async getEventErrors(executionId) {
    return await _getEventErrors(this._mssql, executionId);
  }
  getExecutionStatus() {
    return {
      isExecuting: this._isExecuting,
      executionStatus: this._executionStatus
    };
  }
}
module.exports = ProjectSSIS;
