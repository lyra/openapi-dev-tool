import deployer from '@lyra-network/nexus-deployer';
import colors from 'colors';
import path from 'path';
import { paramCase } from 'change-case';

import { generateSpecsArchive } from '../lib/archiver';
import { getTempDir } from '../lib/utils';
import { bundleSpec, writeOpenApiDocumentToFile } from '../lib/bundler';

// ##################################################################
// The aim of this file is manage the publish command
// ##################################################################

export function publish(config = { config: { specs: [] } }) {
  const promises = [];

  const artifactIds = [];

  // Publish for each spec
  config.config.specs.forEach(async spec => {
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
          archive = await generateSpecsArchive(api, fileToArchive);

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
            api.info.version.match(/-snapshot/i)
          ) {
            server = config.repoSnapshotsServer;
          }

          artifactIds.push(paramCase(api.info.title));

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
            err => {
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
        } catch (err) {
          console.error(
            colors.red(`The API file '${spec.file}' is invalid: ${err.message}`)
          );
          reject();
        }
      })
    );
  });

  return Promise.all(promises);
}
