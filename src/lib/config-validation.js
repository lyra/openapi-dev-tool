import colors from 'colors';
import jsonValidator from 'json-validator';
import YAML from 'yaml';
import rc from 'rc';
import fs from 'fs';
import path from 'path';
import commandExists from 'command-exists';

import { isYAMLFile } from './utils';
import {
  serveUsage,
  publishUsage,
  publishLocalUsage,
  mergeUsage,
} from './config-definitions';

import { getRepoPath, downloadArtifact } from './maven';

// ######################################
// Configuration file schema to validate
// ######################################
function getConfigSchema(data) {
  const enabledDefaultValue = true;
  function transformEnabledProperty(value) {
    if (typeof value == 'boolean') return value;
    else if (typeof value == 'string') {
      // Compute by using env var
      const varEnv = value.replace(/[\${}]/g, '');
      return process.env[varEnv] == 'true';
    }

    // Default value is true
    return enabledDefaultValue;
  }

  function transformVFoldersProperty(value) {
    if (typeof value === 'string') return [value];
    else if (Array.isArray(value) && value.every((i) => typeof i === 'string'))
      return value;
    else return [];
  }

  return {
    specs: [
      {
        file: {
          required: true,
          validate: function (name) {
            // Get enabled related property
            let enabled = true;
            let artifact;
            if (name) {
              const enabledString = data.specs.find(
                (spec) => spec.file == name
              ).enabled;
              artifact = data.specs.find((spec) => spec.file == name).artifact;
              enabled = transformEnabledProperty(enabledString);
            }
            // Artifact, we have to download first
            if (artifact) {
              if (!commandExists.sync('mvn')) {
                errors.push(
                  `'mvn' command does not exist. Impossible to get artifact.`
                );
              } else {
                const folder = downloadArtifact(artifact);
                name = folder + path.sep + name;
                data.specs.find((spec) => spec.artifact == artifact).name =
                  name;
              }
            }

            // Does not need to check file if is not enabled
            const isValid =
              !name || !enabled || (enabled && fs.existsSync(name));
            return {
              isValid,
              message: `File ${name} doesn\'t exist`,
            };
          },
        },
        enabled: {
          default: enabledDefaultValue,
          transform: transformEnabledProperty,
        },
        vFolders: {
          default: [],
          transform: transformVFoldersProperty,
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
    getConfigSchema(options.config),
    (err, messages) => {
      // Validation error messages are a complex structure
      // We have to get message in deep objet!
      function extractMessages(messages) {
        if (Array.isArray(messages)) {
          messages.forEach((message) => {
            extractMessages(message);
          });
        } else if (typeof messages === 'object') {
          Object.keys(messages).forEach((attr) => {
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
    errors.forEach((error) => {
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
    errors.forEach((error) => {
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
  if (optionsBack.repoPath && optionsBack.repoPath !== 'auto')
    options.repoPath = optionsBack.repoPath;

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
  if (
    options.repoPath &&
    typeof options.repoPath === 'string' &&
    options.repoPath === 'auto'
  ) {
    if (!commandExists.sync('mvn')) {
      errors.push(
        `'mvn' command does not exist. Impossible to determinate local repo path.`
      );
    } else {
      options.repoPath = getRepoPath();
      if (!fs.existsSync(options.repoPath)) {
        errors.push(`repoPath '${options.repoPath}' does not exist`);
      }
    }
  }

  globalValidation(options, errors);

  if (errors.length != 0) {
    console.log(colors.red('Syntax error!'));
    errors.forEach((error) => {
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

  if (!options.contextPath) {
    errors.push(`contextPath is mandatory`);
  } else {
    if (!options.contextPath.match(/^\/[0-9a-zA-Z_-]*/)) {
      errors.push(`contextPath is invalid`);
    }
  }
  if (!options.contextPath.match(/\/$/)) {
    options.contextPath = `${options.contextPath}/`;
  }

  if (!options.port) {
    errors.push(`port is mandatory`);
  }

  if (isNaN(options.port) || typeof options.port !== 'number') {
    errors.push(`port is invalid`);
  }

  if (options.viewsFolder) {
    if (
      !fs.existsSync(options.viewsFolder) ||
      !fs.lstatSync(options.viewsFolder).isDirectory()
    ) {
      errors.push(`viewsFolder '${options.viewsFolder}' does not exist`);
    }
  }

  if (options.staticFolders) {
    if (typeof options.staticFolders === 'string') {
      // Just one value
      options.staticFolders = [options.staticFolders];
    }
    options.staticFolders = options.staticFolders.map((staticFolder) => {
      const parts = staticFolder.match(/^(\/[a-zA-Z0-9_-]*):([a-zA-Z0-9_-]+)$/);
      if (!parts || parts.length !== 3) {
        errors.push(`staticFolders '${staticFolder}' incorrect syntax`);
      } else {
        const path = parts[1];
        const folder = parts[2];

        if (
          path === `${options.contextPath}swagger-ui` ||
          path === `${options.contextPath}redoc` ||
          path === `${options.contextPath}assets` ||
          path === `${options.contextPath}reload`
        ) {
          errors.push(
            `staticFolders '${path}' cannot be used. Reserved path for openapi-dev-tool`
          );
        }

        if (!fs.existsSync(folder)) {
          errors.push(`staticFolders '${folder}' does not exist`);
        }
        return { path, folder };
      }
    });
  }

  globalValidation(options, errors);

  if (errors.length != 0) {
    console.log(colors.red('Syntax error!'));
    errors.forEach((error) => {
      console.log(`\t- ${error}`);
    });
    console.log(serveUsage);
    process.exit(1);
  }

  return options;
}
