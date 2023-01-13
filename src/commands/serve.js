#!/usr/bin/env node

import express from 'express';
import reload from 'reload';
import { getAbsoluteFSPath } from 'swagger-ui-dist';
import path from 'path';
import fs from 'fs';
import chokidar from 'chokidar';
import colors from 'colors';
import * as url from 'url';
import { createRequire } from 'module';

import { loadSpecs } from '../lib/specs.js';
import exposer from '../lib/exposer.js';
import viewers from '../lib/viewers.js';
import { viewersPath } from '../lib/viewers.js';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const require = createRequire(import.meta.url);

// ##################################################################
// The aim of this file is manage the serve command
// ##################################################################

function checkDoublon(specs) {
  specs.forEach((spec, index) => {
    const foundDoublon = specs.find((specsFilter, indexFilter) => {
      return specsFilter.name === spec.name && index != indexFilter;
    });
    if (foundDoublon) {
      console.error(colors.red(`Spec ${spec.name} is already defined!`));
      throw new Error(`Spec ${spec.name} is already defined!`);
    }
  });
}

export function serve(config = { config: { specs: [] } }) {
  const app = express();
  return new Promise((resolve, reject) => {
    // Load specs
    let specs;
    loadSpecs(config).then(function (specsResult) {
      specs = specsResult;
      // Find doublon
      try {
        checkDoublon(specs);
      } catch (err) {
        reject(err);
      }

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
      app.get(
        `${config.contextPath}raw/bundle/:specName.(yaml|json)`,
        exposerMiddleware.bundle
      );
      app.get(
        `${config.contextPath}raw/original/:specName*`,
        exposerMiddleware.original
      );

      // Middleware to expose viewers (SwaggerUI & Redoc)
      const viewersMiddleware = viewers(specs, config);

      app.get(`${config.contextPath}swagger-ui`, viewersMiddleware.swaggerUI);
      app.get(`${config.contextPath}redoc`, viewersMiddleware.redoc);
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
      app.use(
        `${config.contextPath}assets`,
        express.static(`${__dirname}/../static`)
      );

      // Possibility for app to override viewers apps
      viewersPath.forEach((viewer) => {
        if (fs.existsSync(`${process.cwd()}/node_modules/${viewer.path}`)) {
          app.use(
            `${config.contextPath}assets`,
            express.static(`${process.cwd()}/node_modules/${viewer.path}`)
          );
          if (config.verbose) {
            console.log(`Viewer '${viewer.name}' loaded from app`);
          }
        }
      });

      // Swagger UI folder
      app.use(
        `${config.contextPath}assets`,
        express.static(getAbsoluteFSPath())
      );
      // Redoc folder
      app.use(
        `${config.contextPath}assets`,
        express.static(path.dirname(require.resolve('redoc')))
      );

      // Start listening
      if (!config.port) {
        console.error(colors.red('Port is undefined'));
        reject();
        return;
      }

      if (process.env.NODE_ENV !== 'test') {
        // Reloader
        reload(app, {
          verbose: config.verbose,
          route: `${config.contextPath}reload`,
        }).then((reloadReturned) => {
          // Specs folders are watched
          // ...new Set but remove items duplicated
          chokidar
            .watch(
              [
                ...new Set(
                  config.config.specs.map((spec) => path.dirname(spec.file))
                ),
              ],
              {
                awaitWriteFinish: {
                  stabilityThreshold: 500,
                },
              }
            )
            .on('all', (event, path) => {
              // Fire server-side reload event
              loadSpecs(config).then((specsResult) => {
                // Find doublon
                try {
                  checkDoublon(specsResult);
                } catch (err) {
                  process.exit(1);
                }

                // Update middlewares with new specs
                exposerMiddleware.updateSpecs(specsResult);
                viewersMiddleware.updateSpecs(specsResult);

                reloadReturned.reload();
              });
            });
        });

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
            app,
          });
        });
      } else {
        resolve(app);
      }
    });
  });
}
