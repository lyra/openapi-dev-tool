import colors from 'colors';
import YAML from 'yaml';
import rc from 'rc';
import fs from 'fs';
import path from 'path';

import jsonValidator from '../json-validator/app.cjs';

import { isYAMLFile } from './utils.js';
import {
  serveUsage,
  publishUsage,
  publishLocalUsage,
  mergeUsage,
} from './config-definitions.js';

import {
  getRepoPath,
  downloadArtifact,
  mvnExists,
  mavenCommand,
} from './maven.js';

const objectFromPath = (obj, path) =>
  path.split('.').reduce((a, v) => a[v], obj);

// ######################################
// Configuration file schema to validate
// ######################################
function getConfigSchema(data, urlDownloadTemplate, verbose) {
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

  function validateArtifact(artifact, fieldPath) {
    // Get enabled related property
    let enabled = true;
    if (artifact) {
      const currentSpec = objectFromPath(
        data,
        fieldPath.replace(/\.artifact$/, '')
      );

      const enabledString = currentSpec.enabled;
      enabled = transformEnabledProperty(enabledString);
      if (enabled) {
        if (artifact.split(':').length !== 3) {
          return {
            isValid: false,
            message: `artifact '${artifact}' is incorrect, should be written like <groupId>:<artifactId>:<version>.`,
          };
        }
      }
    }
    return {
      isValid: true,
    };
  }

  return {
    specs: [
      {
        artifact: {
          validate: validateArtifact,
        },
        file: {
          required: true,
          asyncValidate: function (name, fieldPath, cb) {
            // Valid if not defined (rejected after because of required field)
            if (!name) {
              cb(null, null);
            }
            // Get enabled related property
            let enabled = true;
            let artifact;
            // Get related spec from path (without field "file")
            const currentSpec = objectFromPath(
              data,
              fieldPath.replace(/\.file$/, '')
            );
            const enabledString = currentSpec.enabled;
            artifact = currentSpec.artifact;
            enabled = transformEnabledProperty(enabledString);
            // Artifact, we have to download first (if valid)
            if (artifact && enabled) {
              if (
                validateArtifact(
                  artifact,
                  fieldPath.replace(/\.file$/, '.artifact')
                ).isValid
              ) {
                downloadArtifact(artifact, urlDownloadTemplate, verbose)
                  .then((folder) => {
                    // Does not need to check file if is not enabled
                    const isValid =
                      !enabled ||
                      (enabled && fs.existsSync(folder + path.sep + name));

                    // We update file reference to prepend temp folder of unpacked artifact
                    currentSpec.file = folder + path.sep + name;
                    if (isValid) cb(null, null);
                    else
                      cb(
                        null,
                        `file '${name}' doesn\'t exist in artifact '${artifact}'`
                      );
                  })
                  .catch((err) => {
                    cb(
                      null,
                      `artifact '${artifact}' cannot be downloaded, ${err.message}`
                    );
                  });
              } else {
                cb(null, null);
              }
            } else {
              // Does not need to check file if is not enabled
              const isValid = !enabled || (enabled && fs.existsSync(name));
              if (isValid) cb(null, null);
              else cb(null, `file '${name}' doesn\'t exist`);
            }
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
  return new Promise((resolve) => {
    // Detect unknown parameters
    if (options._unknown && options._unknown.length > 0) {
      errors.push(`Option '${options._unknown[0]}' unknown`);
      resolve();
      return;
    }

    if (!fs.existsSync(options.config)) {
      errors.push(`File '${options.config}' does not exit`);
      resolve();
      return;
    }

    // Reading config file
    let configRaw = fs.readFileSync(options.config, 'utf-8');
    if (isYAMLFile(options.config)) {
      options.config = YAML.parse(configRaw);
    } else {
      try {
        options.config = JSON.parse(configRaw);
      } catch {
        options.config = {};
      }
    }
    if (!options.config) {
      options.config = {};
    }

    jsonValidator.validate(
      options.config,
      getConfigSchema(
        options.config,
        options.urlDownloadTemplate,
        options.verbose
      ),
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
        resolve();
      }
    );
  });
}

export async function mergeValidation(options) {
  if (!options) {
    return {};
  }

  // We merge configuration from rc file
  options = { ...options, ...rc('openapi-dev-tool'), config: options.config };

  let errors = [];

  if (!options.config || typeof options.config !== 'string') {
    errors.push(`config is mandatory`);
  }

  await globalValidation(options, errors);

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

export async function publishValidation(options) {
  if (!options) {
    return {};
  }

  // We merge configuration from rc file
  const optionsBack = options;
  options = { ...options, ...rc('openapi-dev-tool'), config: options.config };

  // User and password can be overriden from command line
  if (optionsBack.repoUser) options.repoUser = optionsBack.repoUser;
  if (optionsBack.repoPassword) options.repoPassword = optionsBack.repoPassword;
  if (optionsBack.groupId) options.groupId = optionsBack.groupId;

  let errors = [];

  if (!options.config || typeof options.config !== 'string') {
    errors.push(`config is mandatory`);
  }

  if (!options.repoServer || typeof options.repoServer !== 'string') {
    errors.push(`repoServer is mandatory`);
  }

  if (!options.repoType || typeof options.repoType !== 'string') {
    errors.push(`repoType is mandatory`);
  }

  if (
    options.repoServer &&
    options.repoServer.match &&
    !options.repoServer.match(/(https?:\/\/)?(www\.)?\w{2,}(\.\w{2,}){1,}/)
  ) {
    errors.push(`repoServer is not a valid url`);
  }

  if (options.repoType !== 'maven' && options.repoType !== 'npm') {
    errors.push(`repoType is not valid. maven or npm can be specified`);
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

  if (!options.groupId) {
    if (options.repoType === 'maven') options.groupId = 'com.openapi';
    else options.groupId = '@myCompany';
  }

  if (typeof options.groupId !== 'string') {
    errors.push(`groupId is mandatory`);
  }

  if (
    (!options.repoToken || typeof options.repoToken !== 'string') &&
    (!options.repoUser || typeof options.repoUser !== 'string')
  ) {
    errors.push(
      `One authentication method has to be defined. repoUser or repoToken is mandatory`
    );
  }

  if (options.repoUser && options.repoToken) {
    errors.push(
      `Only one authentication method has to be defined. repoUser or repoToken is mandatory`
    );
  }

  if (
    options.repoUser &&
    (!options.repoPassword || typeof options.repoPassword !== 'string')
  ) {
    errors.push(`repoPassword is mandatory`);
  }

  await globalValidation(options, errors);

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

export async function publishLocalValidation(options) {
  if (!options) {
    return {};
  }

  // We merge configuration from rc file
  const optionsBack = options;
  options = { ...options, ...rc('openapi-dev-tool'), config: options.config };

  let errors = [];

  if (!options.config || typeof options.config !== 'string') {
    errors.push(`config is mandatory`);
  }

  if (typeof options.groupId !== 'string') {
    errors.push(`groupId is mandatory`);
  }

  if (!options.groupId) {
    options.groupId = 'com.openapi';
  }
  // Check local repository path by using mvn command
  if (!mvnExists()) {
    errors.push(
      `'${mavenCommand}' command does not exist. Impossible to determinate local repository path.`
    );
  } else {
    const repoPath = getRepoPath();
    if (!fs.existsSync(repoPath)) {
      errors.push(`Local repository '${repoPath}' does not exist`);
    }
  }

  await globalValidation(options, errors);

  if (errors.length !== 0) {
    console.log(colors.red('Syntax error!'));
    errors.forEach((error) => {
      console.log(`\t- ${error}`);
    });
    console.log(publishLocalUsage);
    process.exit(1);
  }

  return options;
}

export async function serveValidation(options) {
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

  await globalValidation(options, errors);

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
