#!/usr/bin/env node

import express from 'express';
import reload from 'reload';
import { getAbsoluteFSPath } from 'swagger-ui-dist';
import path from 'path';
import fs from 'fs';
import chokidar from 'chokidar';
import colors from 'colors';

import { loadSpecs } from '../lib/specs';
import exposer from '../lib/exposer';
import viewers from '../lib/viewers';

// ##################################################################
// The aim of this file is manage the serve command
// ##################################################################

export function serve(config = { config: { specs: [] } }) {
  const app = express();

  return new Promise((resolve, reject) => {
    // Load specs
    let specs;
    loadSpecs(config).then(function (specsResult) {
      specs = specsResult;

      // Find doublon
      specs.forEach((spec, index) => {
        const foundDoublon = specs.find((specsFilter, indexFilter) => {
          return specsFilter.name === spec.name && index != indexFilter;
        });
        if (foundDoublon) {
          console.error(colors.red(`Spec ${spec.name} is already defined!`));
          throw new Error(`Spec ${spec.name} is already defined!`);
        }
      });

      // set the view engine to ejs
      app.set('view engine', 'ejs');

      const viewsFolder = [];

      if (
        config.viewsFolder &&
        fs.existsSync(config.viewsFolder) &&
        fs.lstatSync(config.viewsFolder).isDirectory()
      ) {
        viewsFolder.push(config.viewsFolder);
      }
      viewsFolder.push(__dirname + '/../views');
      app.set('views', viewsFolder);

      // Middleware to expose OpenAPI files original and bundle
      const exposerMiddleware = exposer(config, specs);
      app.get('/raw/bundle/:specName.(yaml|json)', exposerMiddleware.bundle);
      app.get('/raw/original/:specName*', exposerMiddleware.original);

      // Middleware to expose viewers (SwaggerUI & Redoc)
      const viewersMiddleware = viewers(specs, config);
      app.get('/swagger-ui', viewersMiddleware.swaggerUI);
      app.get('/redoc', viewersMiddleware.redoc);
      app.get(config.contextPath, viewersMiddleware.home);

      // Add static folder
      if (config.staticFolders) {
        config.staticFolders.forEach((staticFolder) => {
          app.use(
            `${staticFolder.path}`,
            express.static(`${staticFolder.folder}`)
          );
        });
      }

      // Add static folders
      app.use('/assets', express.static(`${__dirname}/../static`));
      // Swagger UI folder
      app.use('/assets', express.static(getAbsoluteFSPath()));
      // Redoc folder
      app.use(
        '/assets',
        express.static(path.dirname(require.resolve('redoc')))
      );
      // RedocPro folder
      app.use(
        '/assets',
        express.static(
          path.resolve(path.dirname(require.resolve('@redoc/redoc-pro'))) +
            '/../dist'
        )
      );

      app.use(
        '/assets',
        express.static(path.dirname(require.resolve('reload') + '/lib'))
      );

      // Reloader
      reload(app, { verbose: config.verbose }).then((reloadReturned) => {
        // Specs folder is watched
        chokidar.watch(config.config.folder).on('all', (event, path) => {
          // Fire server-side reload event
          loadSpecs(config).then((specsResult) => {
            // Update middlewares with new specs
            exposerMiddleware.updateSpecs(specsResult);
            viewersMiddleware.updateSpecs(specsResult);

            reloadReturned.reload();
          });
        });
      });

      // Start listening
      if (!config.port) {
        console.error(colors.red('Port is undefined'));
        reject();
        return;
      }

      const server = app.listen(config.port, function () {
        console.log(`OpenAPI dev server listening on port ${config.port}!`);
        console.log(
          `You can now open your browser on ${colors.underline(
            `http://localhost:${config.port}`
          )}!`
        );
        resolve({
          close: () => {
            server.close();
          },
        });
      });
    });
  });
}
