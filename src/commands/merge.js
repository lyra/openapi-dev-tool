import colors from 'colors';
import path from 'path';
import { kebabCase } from 'change-case';
import settle from 'promise-settle';
import fs from 'fs';

import { bundleSpec, writeOpenApiDocumentToFile } from '../lib/bundler.js';

// ##################################################################
// The aim of this file is manage the merge command
// ##################################################################

/**
 * Merge and write spec to filesystem
 * @param config
 */
export function merge(config = { config: { specs: [] } }) {
  const promises = [];

  const artifactIds = [];

  // Merge for each spec
  // We filter to work only on enabled specs
  config.config.specs
    .filter((spec) => spec.enabled)
    .forEach(async (spec) => {
      promises.push(
        new Promise(async (resolve, reject) => {
          try {
            const filename = path.basename(spec.file);
            const api = await bundleSpec(config, spec);

            // Apply filter if it is defined
            if (config.filter && api.info.title !== config.filter) {
              console.log("\tspec '%s': ignored by filter", api.info.title);
              resolve();
              return;
            }

            const outputDir = getOutputDirFromConfig(config);

            // Create output dir if does not exist
            if (!fs.existsSync(outputDir)) {
              fs.mkdirSync(outputDir, { recursive: true });
            } else {
              const stats = fs.lstatSync(outputDir);
              if (!stats.isDirectory()) {
                fs.mkdirSync(outputDir, { recursive: true });
              }
            }

            // Find doublon
            if (artifactIds.indexOf(kebabCase(api.info.title)) != -1) {
              throw new Error(
                `Spec "${api.info.title}" has an artifactId "${kebabCase(
                  api.info.title
                )}" already defined!`
              );
            }

            const targetFile = writeOpenApiDocumentToFile(
              outputDir,
              kebabCase(api.info.title) + path.extname(filename),
              spec.file,
              api
            );

            artifactIds.push(kebabCase(api.info.title));
            resolve();
            console.log(
              "\tspec '%s': merged split files into a single one: %s",
              api.info.title,
              targetFile
            );
          } catch (err) {
            reject();
            if (config.verbose) {
              console.error(
                colors.red(
                  `The API file '${spec.file}' is invalid: ${err.message}`
                ),
                err
              );
            } else {
              console.error(
                colors.red(
                  `The API file '${spec.file}' is invalid: ${err.message}`
                )
              );
            }
          }
        })
      );
    });

  return settle(promises);
}

/**
 * Get output directory from config
 * @param config
 * @returns {string|output|Array|any|string}
 */
function getOutputDirFromConfig(config) {
  let outputDir = config.output;
  if (!config.output) {
    outputDir = '.';
    if (config.verbose) {
      console.log(
        'No output provided, default one is in the current directory'
      );
    }
  }
  return outputDir;
}
