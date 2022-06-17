import commandLineUsage from 'command-line-usage';

import app from '../../package.json';

// ######################################
// Command line options definitions
// ######################################
const mainDefinitions = [{ name: 'command', defaultOption: true }];

const commandDefinitions = [
  {
    name: 'serve',
    summary:
      'Serve one or serveral OpenAPI specification files in YAML or JSON format',
  },
  {
    name: 'publish',
    summary:
      'Publish into a software repository server (like Sonartype Nexus) one or serveral OpenAPI specifications files',
  },
  {
    name: 'publish-local',
    summary: 'Publish into a local Maven repository',
  },
  {
    name: 'merge',
    summary:
      'Merge split OpenAPI specification (components, paths, info, etc.) into a bundled specification file',
  },
  {
    name: 'help',
    summary: 'Shows this help message, or help for a specific command',
  },
];

const globalOptionsDefinitions = [
  {
    name: 'config',
    alias: 'c',
    type: String,
    defaultValue: 'config.json',
    description:
      'Configuration file in JSON or YAML format where specifications are defined, default is config.json',
  },
  {
    name: 'verbose',
    alias: 'v',
    type: Boolean,
    defaultValue: false,
    description: 'Verbose mode, default is false',
  },
  {
    name: 'urlDownloadTemplate',
    alias: 'a',
    type: String,
    description:
      "Rather to use specs from local FS, you can specify remote specs (using 'artifact' config property) which will be downloaded by using this url. From this url template '[ARTIFACT_ID]', '[GROUP_ID]' and '[VERSION]' will be replaced.",
  },
];

const serveOptionsDefinitions = [
  {
    name: 'skipBundle',
    alias: 'b',
    type: Boolean,
    defaultValue: false,
    description:
      'Skips bundle openapi files into one before serving or publishing, default is false',
  },
  {
    name: 'port',
    alias: 'p',
    type: Number,
    defaultValue: 3000,
    description: 'Port to use, default is 3000',
  },
  {
    name: 'contextPath',
    alias: 'u',
    type: String,
    defaultValue: '/',
    description:
      "Context used to expose openapi documentations. Has to be start with '/', default is '/'",
  },
  {
    name: 'viewsFolder',
    alias: 'e',
    type: String,
    description:
      'Folder that contains views in EJS to override defaults\n- "api.ejs": for API List page\n- "redoc.ejs": for Redoc page\n- "swagger-ui.ejs": for Swagger UI page',
  },
  {
    name: 'staticFolders',
    alias: 's',
    type: String,
    multiple: true,
    description:
      'Exposes a static folder in addition of openapi documentation, for example, if you want expose general documentation (migration, API overview,...)\nHas to be a map like :\n/<path1>:<folder1> where path1 and folder1 have to [a-zA-Z0-9_-]+\nopenapi-dev-tool will create a path "/path1" where static files of folder "folder1" will be exposed',
  },
  {
    name: 'skipValidation',
    alias: 'x',
    type: Boolean,
    defaultValue: false,
    description: 'Skips OpenAPI validation process, default is false',
  },
];

const publishOptionsDefinitions = [
  {
    name: 'skipBundle',
    alias: 'b',
    type: Boolean,
    defaultValue: false,
    description:
      'Skips bundle openapi files into one before serving or publishing, default is false',
  },
  {
    name: 'groupId',
    alias: 'g',
    type: String,
    defaultValue: 'com.openapi',
    description: 'GroupId used in repo server, default is com.openapi',
  },
  {
    name: 'repoServer',
    alias: 's',
    type: String,
    description: 'Repository server url to store OpenAPI specification files',
  },
  {
    name: 'repoSnapshotsServer',
    type: String,
    description:
      'Repository server url to store OpenAPI snapshots specification files. If specified, --repoServer will be used to store OpenAPI releases specification files.',
  },
  {
    name: 'repoUser',
    alias: 'u',
    type: String,
    description: 'Repository server username',
  },
  {
    name: 'repoPassword',
    alias: 'p',
    type: String,
    description: 'Repository server password',
  },
  {
    name: 'skipValidation',
    alias: 'x',
    type: Boolean,
    defaultValue: false,
    description: 'Skips OpenAPI validation process, default is false',
  },
];

const publishLocalOptionsDefinitions = [
  {
    name: 'skipBundle',
    alias: 'b',
    type: Boolean,
    defaultValue: false,
    description:
      'Skips bundle openapi files into one before serving or publishing, default is false',
  },
  {
    name: 'groupId',
    alias: 'g',
    type: String,
    defaultValue: 'com.openapi',
    description: 'GroupId used in repo server, default is com.openapi',
  },
  {
    name: 'repoPath',
    alias: 'd',
    type: String,
    defaultValue: 'auto',
    description:
      "Path of Maven local repository, default is 'auto': determinated automatically by using 'mvn' command (if available)",
  },
  {
    name: 'skipValidation',
    alias: 'x',
    type: Boolean,
    defaultValue: false,
    description: 'Skips OpenAPI validation process, default is false',
  },
];

const mergeOptionsDefinitions = [
  {
    name: 'output',
    alias: 'o',
    type: String,
    description: 'Merged file output directory',
  },
];

// ######################################
// Command line usages definitions
// ######################################
const globalUsage = commandLineUsage([
  {
    header: 'OpenAPI Dev Tool',
    content: `v${app.version}\nA simple way to develop your OpenAPI specification files\n\nUsage: \`openapi-dev-tool <command> [options ...]\``,
  },
  {
    header: 'Available Commands',
    content: commandDefinitions,
  },
  {
    header: 'Global Options',
    optionList: globalOptionsDefinitions,
  },
  {
    content:
      'Run `openapi-dev-tool help <command>` for help with a specific command.',
    raw: true,
  },
]);

const serveUsage = commandLineUsage([
  {
    header: 'openapi-dev-tool serve',
    content:
      'Serve one or serveral OpenAPI specification files in YAML or JSON format',
  },
  {
    header: 'Command Options',
    optionList: serveOptionsDefinitions,
  },
  {
    header: 'Global Options',
    optionList: globalOptionsDefinitions,
  },
]);

const publishUsage = commandLineUsage([
  {
    header: 'openapi-dev-tool publish',
    content:
      'Publish into a software repository server (like Sonartype Nexus) one or serveral OpenAPI specifications files',
  },
  {
    header: 'Command Options',
    optionList: publishOptionsDefinitions,
  },
  {
    header: 'Global Options',
    optionList: globalOptionsDefinitions,
  },
]);

const publishLocalUsage = commandLineUsage([
  {
    header: 'openapi-dev-tool publish-local',
    content: 'Publish into a local Maven repository',
  },
  {
    header: 'Command Options',
    optionList: publishLocalOptionsDefinitions,
  },
  {
    header: 'Global Options',
    optionList: globalOptionsDefinitions,
  },
]);

const mergeUsage = commandLineUsage([
  {
    header: 'openapi-dev-tool merge',
    content:
      'Merge split OpenAPI specification (components, paths, info, etc.) into a bundled specification file',
  },
  {
    header: 'Command Options',
    optionList: mergeOptionsDefinitions,
  },
  {
    header: 'Global Options',
    optionList: globalOptionsDefinitions,
  },
]);

export {
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
};
