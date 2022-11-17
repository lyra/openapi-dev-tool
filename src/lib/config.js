import commandLineArgs from 'command-line-args';
import {
  mainDefinitions,
  serveOptionsDefinitions,
  globalOptionsDefinitions,
  mergeOptionsDefinitions,
  publishOptionsDefinitions,
  publishLocalOptionsDefinitions,
  globalUsage,
  serveUsage,
  publishUsage,
  publishLocalUsage,
  mergeUsage,
} from './config-definitions.js';

import {
  serveValidation,
  mergeValidation,
  publishValidation,
  publishLocalValidation,
} from './config-validation.js';

// ##################################################################
// This file manage the command line options
// and the validation with command line options and content of
// config file
// ##################################################################

// ######################################
// Execution
// ######################################
const mainOptions = commandLineArgs(mainDefinitions, {
  stopAtFirstUnknown: true,
});
const argv = mainOptions._unknown || [];
// If help command
let options;
if (mainOptions.command === 'help') {
  if (
    mainOptions._unknown &&
    mainOptions._unknown.length > 0 &&
    mainOptions._unknown[0] === 'serve'
  ) {
    console.log(serveUsage);
    process.exit(0);
  } else if (
    mainOptions._unknown &&
    mainOptions._unknown.length > 0 &&
    mainOptions._unknown[0] === 'publish'
  ) {
    console.log(publishUsage);
    process.exit(0);
  } else if (
    mainOptions._unknown &&
    mainOptions._unknown.length > 0 &&
    mainOptions._unknown[0] === 'publish-local'
  ) {
    console.log(publishLocalUsage);
    process.exit(0);
  } else if (
    mainOptions._unknown &&
    mainOptions._unknown.length > 0 &&
    mainOptions._unknown[0] === 'merge'
  ) {
    console.log(mergeUsage);
    process.exit(0);
  } else {
    console.log(globalUsage);
    process.exit(0);
  }
} else if (mainOptions.command === 'serve') {
  options = commandLineArgs(
    serveOptionsDefinitions.concat(globalOptionsDefinitions),
    { argv, stopAtFirstUnknown: true }
  );
} else if (mainOptions.command === 'publish') {
  options = commandLineArgs(
    publishOptionsDefinitions.concat(globalOptionsDefinitions),
    { argv, stopAtFirstUnknown: true }
  );
} else if (mainOptions.command === 'publish-local') {
  options = commandLineArgs(
    publishLocalOptionsDefinitions.concat(globalOptionsDefinitions),
    { argv, stopAtFirstUnknown: true }
  );
} else if (mainOptions.command === 'merge') {
  options = commandLineArgs(
    mergeOptionsDefinitions.concat(globalOptionsDefinitions),
    { argv, stopAtFirstUnknown: true }
  );
} else {
  console.log(globalUsage);
  process.exit(0);
}

let config;
if (mainOptions.command === 'serve') {
  config = serveValidation(options);
} else if (mainOptions.command === 'publish') {
  config = publishValidation(options);
} else if (mainOptions.command === 'publish-local') {
  config = publishLocalValidation(options);
} else if (mainOptions.command === 'merge') {
  config = mergeValidation(options);
}

export default { command: mainOptions.command, config };
