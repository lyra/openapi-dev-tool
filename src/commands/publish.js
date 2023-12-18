import deployer from '@lyra-network/nexus-deployer';
import colors from 'colors';
import path from 'path';
import { paramCase } from 'change-case';
import settle from 'promise-settle';
import { publish as npmPublish } from 'libnpmpublish';
import fs from 'fs';

import { generateSpecsArchive } from '../lib/archiver.js';
import { getTempDir } from '../lib/utils.js';
import { bundleSpec, writeOpenApiDocumentToFile } from '../lib/bundler.js';

// ##################################################################
// The aim of this file is manage the publish command
// ##################################################################

export function publish(config = { config: { specs: [] } }) {
  const promises = [];

  const artifactIds = [];

  // Publish for each spec
  // We filter to work only on enabled specs
  config.config.specs
    .filter((spec) => spec.enabled)
    .forEach(async (spec) => {
      promises.push(
        new Promise(async (resolve, reject) => {
          try {
            const api = await bundleSpec(config, spec);
            const tempDir = getTempDir();

            let fileToArchive = spec.file;
            let archive;
            if (!config.skipBundle) {
              fileToArchive = writeOpenApiDocumentToFile(
                tempDir.name,
                path.basename(spec.file),
                spec.file,
                api
              );
            }
            const files = [fileToArchive];
            // If npm, we have to add a package.json file
            const packageNpm = {
              name: `${config.groupId}/${paramCase(api.info.title)}`,
              version: api.info.version,
              main: path.basename(spec.file),
            };
            if (config.repoType === 'npm') {
              var packageNpmJson = JSON.stringify(packageNpm, null, 2);
              fs.writeFileSync(
                `${tempDir.name}/package.json`,
                packageNpmJson,
                'utf8'
              );
              files.push(`${tempDir.name}/package.json`);
            }
            archive = await generateSpecsArchive(api, files, config.repoType);

            // Find doublon
            if (artifactIds.indexOf(paramCase(api.info.title)) != -1) {
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

            // Determine the repo server to use
            // - If release --> repoServer
            // - If snapshot --> repoSnapshotsServer
            let server = config.repoServer;

            if (
              config.repoSnapshotsServer &&
              api.info.version.match(/-snapshot/i) &&
              config.repoType === 'maven'
            ) {
              server = config.repoSnapshotsServer;
            }

            artifactIds.push(paramCase(api.info.title));

            if (config.repoType === 'maven') {
              deployer.deploy(
                {
                  groupId: config.groupId,
                  artifactId: paramCase(api.info.title),
                  version: api.info.version,
                  packaging: 'zip',
                  auth: {
                    username: config.repoUser,
                    password: config.repoPassword,
                  },
                  pomDir: path.dirname(archive),
                  url: server,
                  artifact: archive,
                  insecure: true,
                  quiet: !config.verbose,
                },
                (err) => {
                  if (err) {
                    reject();
                    console.error(
                      colors.red(
                        `Unable to publish specs '${paramCase(api.info.title)}'`
                      )
                    );
                  } else {
                    resolve();
                  }
                }
              );
            } else {
              let auth = { token: config.repoToken };
              if (config.repoUser && config.repoPassword) {
                auth = {
                  auth: Buffer.from(
                    `${config.repoUser}:${config.repoPassword}`
                  ).toString('base64'),
                };
              }
              npmPublish(packageNpm, fs.readFileSync(archive), {
                registry: config.repoServer,
                forceAuth: { ...auth },
                strictSSL: false,
              })
                .then(() => {
                  resolve();
                })
                .catch((err) => {
                  reject();
                  console.error(
                    colors.red(
                      `Unable to publish specs '${paramCase(
                        api.info.title
                      )}': ${err}`
                    )
                  );
                });
            }
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
