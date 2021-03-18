#!/usr/bin/env node

import figlet from 'figlet';
import colors from 'colors';

import config from './lib/config';
import { serve } from './commands/serve';
import { publish } from './commands/publish';
import { publishLocal } from './commands/publish-local';
import { merge } from './commands/merge';
import app from '../package.json';

// Welcome to openapi dev tool
figlet('OpenAPI Dev Tool', async (err, data) => {
  if (err) {
    console.log('Something went wrong...');
    console.dir(err);
    return -1;
  }

  console.log(colors.cyan(data));
  console.log(`v${app.version}`);
  console.log('\nExecuting ' + colors.cyan(config.command) + ' command...\n');
  if (config.command === 'serve') {
    // Serve
    serve(config.config).catch(() => {
      process.exit(1);
    });
  } else if (config.command === 'publish') {
    // Publish
    publish(config.config).catch(() => {});
  } else if (config.command === 'publish-local') {
    // Publish local
    publishLocal(config.config).catch(() => {});
  } else if (config.command === 'merge') {
    // merge specs into one single file
    merge(config.config).catch(() => {});
  }
});
