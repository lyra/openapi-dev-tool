import colors from 'colors';
import path from 'path';
import { paramCase } from 'change-case';
import settle from 'promise-settle';
import fs from 'fs';

import { generateSpecsArchive } from '../lib/archiver.js';
import { getTempDir, getPOMContent } from '../lib/utils.js';
import { bundleSpec, writeOpenApiDocumentToFile } from '../lib/bundler.js';
import { getRepoPath, installToLocalRepository } from '../lib/maven.js';

// ##################################################################
// The aim of this file is manage the publish command
// ##################################################################

export function publishLocal(config = { config: { specs: [] } }) {
  const promises = [];

  const artifactIds = [];

  console.log('\tPublishing into: %s\n', getRepoPath());

  // Publish for each spec
  // We filter to work only on enabled specs
  config.config.specs
    .filter((spec) => spec.enabled)
    .forEach(async (spec) => {
      promises.push(
        new Promise(async (resolve, reject) => {
          try {
            const api = await bundleSpec(config, spec);

            let fileToArchive = spec.file;
            let archive;
            if (!config.skipBundle) {
              fileToArchive = writeOpenApiDocumentToFile(
                getTempDir().name,
                path.basename(spec.file),
                spec.file,
                api
              );
            }
            archive = await generateSpecsArchive(api, fileToArchive, 'maven');

            // Find doublon
            if (artifactIds.indexOf(paramCase(api.info.title)) !== -1) {
              throw new Error(
                `Spec "${api.info.title}" has an artifactId "${paramCase(
                  api.info.title
                )}" already defined!`
              );
            }

            if (paramCase(api.info.title) === api.info.title) {
              console.log(
                '\tPublishing API name: %s, Version: %s',
                paramCase(api.info.title),
                api.info.version
              );
            } else {
              console.log(
                '\tPublishing API name: %s (%s), Version: %s',
                paramCase(api.info.title),
                api.info.title,
                api.info.version
              );
            }
            if (config.verbose) {
              if (!config.skipBundle) {
                console.log(
                  '\tArchive: %s (bundled file)',
                  path.basename(archive)
                );
              } else {
                console.log('\tArchive: %s', path.basename(archive));
              }
            }

            artifactIds.push(paramCase(api.info.title));

            // Write temporary pom file
            const pomContent = getPOMContent(
              paramCase(api.info.title),
              api.info.version,
              config.groupId,
              'zip'
            );

            const pomFile = `${getTempDir().name}/${
              path.parse(archive).name
            }.pom`;
            fs.writeFileSync(pomFile, pomContent);

            // Install with maven plugin
            await installToLocalRepository(archive, pomFile);
          } catch (err) {
            console.error(
              colors.red(
                `The API file '${spec.file}' is invalid: ${err.message}`
              )
            );
            reject();
          }
        })
      );
    });

  return settle(promises);
}
