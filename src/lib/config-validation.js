import colors from 'colors';
import jsonValidator from 'json-validator';
import YAML from 'yaml';
import rc from 'rc';
import fs from 'fs';
import { execSync } from 'child_process';
import path from 'path';
import commandExists from 'command-exists';

import { isYAMLFile } from './utils';
import { serveUsage, publishUsage, publishLocalUsage, mergeUsage } from './config-definitions';

const mavenLocalPathCmd = 'mvn help:evaluate -Dexpression=settings.localRepository -q -DforceStdout';

// ######################################
// Configuration file schema to validate
// ######################################
function getConfigSchema(options) {
  return {
    folder: {
      required: true,
      validate: function(name) {
        return {
          isValid: name ? fs.existsSync(name) : true,
          message: `Folder ${name} doesn\'t exist`,
        };
      },
    },
    specs: [
      {
        file: {
          required: true,
          validate: function(name) {
            return {
              isValid: name
                ? fs.existsSync(path.join(options.config.folder, name))
                : true,
              message: options.config.folder
                ? `File ${path.join(
                    options.config.folder,
                    name
                  )} doesn\'t exist`
                : `File ${name} doesn\'t exist`,
            };
          },
        },
        context: {
          required: false,
        },
      },
    ],
  };
}

function globalValidation(options, errors) {
  // Detect unknown parameters
  if (options._unknown && options._unknown.length > 0) {
    errors.push(`Option '${options._unknown[0]}' unknow`);
    return;
  }

  if (!fs.existsSync(options.config)) {
    errors.push(`File '${options.config}' does not exit`);
    return;
  }
  // Reading config file
  let configRaw = fs.readFileSync(options.config, 'utf-8');
  if (isYAMLFile(options.config)) {
    options.config = YAML.parse(configRaw);
  } else {
    options.config = JSON.parse(configRaw);
  }
  if (!options.config) {
    options.config = {};
  }

  jsonValidator.validate(
    options.config,
    getConfigSchema(options),
    (err, messages) => {
      // Validation error messages are a complex structure
      // We have to get message in deep objet!
      function extractMessages(messages) {
        if (Array.isArray(messages)) {
          messages.forEach(message => {
            extractMessages(message);
          });
        } else if (typeof messages === 'object') {
          Object.keys(messages).forEach(attr => {
            extractMessages(messages[attr]);
          });
        } else {
          if (typeof messages === 'string' || messages instanceof String) {
            errors.push(`In config file: ${messages}`);
          }
        }
      }

      extractMessages(messages);
    }
  );
}

export function mergeValidation(options) {
  if (!options) {
    return {};
  }

  // We merge configuration from rc file
  options = { ...options, ...rc('openapi-dev-tool'), config: options.config };

  let errors = [];

  if (!options.config || typeof options.config !== 'string') {
    errors.push(`config is mandatory`);
  }

  globalValidation(options, errors);

  if (errors.length != 0) {
    console.log(colors.red('Syntax error!'));
    errors.forEach(error => {
      console.log(`\t- ${error}`);
    });
    console.log(mergeUsage);
    process.exit(1);
  }

  return options;
}

export function publishValidation(options) {
  if (!options) {
    return {};
  }

  // We merge configuration from rc file
  const optionsBack = options;
  options = { ...options, ...rc('openapi-dev-tool'), config: options.config };

  // User and password can be overriden from command line
  if (optionsBack.repoUser) options.repoUser = optionsBack.repoUser;
  if (optionsBack.repoPassword) options.repoPassword = optionsBack.repoPassword;
  if (optionsBack.groupId && optionsBack.groupId !== 'com.openapi')
    options.groupId = optionsBack.groupId;

  let errors = [];

  if (!options.config || typeof options.config !== 'string') {
    errors.push(`config is mandatory`);
  }

  if (!options.repoServer || typeof options.repoServer !== 'string') {
    errors.push(`repoServer is mandatory`);
  }

  if (
    options.repoServer &&
    options.repoServer.match &&
    !options.repoServer.match(/(https?:\/\/)?(www\.)?\w{2,}(\.\w{2,}){1,}/)
  ) {
    errors.push(`repoServer is not a valid url`);
  }

  if (
    options.repoSnapshotsServer &&
    options.repoSnapshotsServer.match &&
    !options.repoSnapshotsServer.match(
      /(https?:\/\/)?(www\.)?\w{2,}(\.\w{2,}){1,}/
    )
  ) {
    errors.push(`repoSnapshotsServer is not a valid url`);
  }

  if (!options.groupId || typeof options.groupId !== 'string') {
    errors.push(`groupId is mandatory`);
  }

  if (!options.repoUser || typeof options.repoUser !== 'string') {
    errors.push(`repoUser is mandatory`);
  }

  if (!options.repoPassword || typeof options.repoPassword !== 'string') {
    errors.push(`repoPassword is mandatory`);
  }

  globalValidation(options, errors);

  if (errors.length != 0) {
    console.log(colors.red('Syntax error!'));
    errors.forEach(error => {
      console.log(`\t- ${error}`);
    });
    console.log(publishUsage);
    process.exit(1);
  }

  return options;
}

export function publishLocalValidation(options) {
  if (!options) {
    return {};
  }

  // We merge configuration from rc file
  const optionsBack = options;
  options = { ...options, ...rc('openapi-dev-tool'), config: options.config };

  // User and password can be overriden from command line
  if (optionsBack.repoPath && optionsBack.repoPath !== 'auto') options.repoPath = optionsBack.repoPath;

  let errors = [];

  if (!options.config || typeof options.config !== 'string') {
    errors.push(`config is mandatory`);
  }

  if (!options.repoPath || typeof options.repoPath !== 'string') {
    errors.push(`repoPath is mandatory`);
  }

  if (!options.groupId || typeof options.groupId !== 'string') {
    errors.push(`groupId is mandatory`);
  }

  // If repoPath is not auto then directory has to exist
  if (
    options.repoPath &&
    typeof options.repoPath === 'string' &&
    options.repoPath !== 'auto' &&
    !fs.existsSync(options.repoPath)
  ) {
    errors.push(`repoPath '${options.repoPath}' folder does not exist`);
  }

  // If repoPath is auto then trying to determinate by using mvn command
  if (options.repoPath && typeof options.repoPath === 'string' &&
    options.repoPath === 'auto'
  ) {
    if (!commandExists.sync('mvn')) {
      errors.push(`'mvn' command does not exist. Impossible to determinate local repo path.`);
    } else {
      options.repoPath = execSync(mavenLocalPathCmd).toString();
      if (!fs.existsSync(options.repoPath)) {
        errors.push(`repoPath '${options.repoPath}' does not exist`);
      }
    }
  }

  

  globalValidation(options, errors);

  if (errors.length != 0) {
    console.log(colors.red('Syntax error!'));
    errors.forEach(error => {
      console.log(`\t- ${error}`);
    });
    console.log(publishLocalUsage);
    process.exit(1);
  }

  return options;
}

export function serveValidation(options) {
  if (!options) {
    return {};
  }

  // We merge configuration from rc file
  options = { ...options, ...rc('openapi-dev-tool'), config: options.config };

  let errors = [];

  if (!options.config || typeof options.config !== 'string') {
    errors.push(`config is mandatory`);
  }

  if (!options.port) {
    errors.push(`port is mandatory`);
  }

  if (isNaN(options.port) || typeof options.port !== 'number') {
    errors.push(`port is invalid`);
  }

  globalValidation(options, errors);

  if (errors.length != 0) {
    console.log(colors.red('Syntax error!'));
    errors.forEach(error => {
      console.log(`\t- ${error}`);
    });
    console.log(serveUsage);
    process.exit(1);
  }

  return options;
}
