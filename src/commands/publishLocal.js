import colors from 'colors';
import path from 'path';
import { paramCase } from 'change-case';
import settle from 'promise-settle';
import mkdirp from 'mkdirp';
import fs from 'fs';

import { generateSpecsArchive } from '../lib/archiver';
import { getTempDir } from '../lib/utils';
import { bundleSpec, writeOpenApiDocumentToFile } from '../lib/bundler';

// ##################################################################
// The aim of this file is manage the publish command
// ##################################################################

export function publishLocal(config = { config: { specs: [] } }) {
  const promises = [];

  const artifactIds = [];

  console.log('\tPublishing into: %s\n', config.repoPath);

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

          artifactIds.push(paramCase(api.info.title));

          // Publish!!
          // copy archive file into config.repoPath / config.groupId / paramCase(api.info.title) / api.info.version
          const target = `${config.repoPath}/${config.groupId.replace(/\./g, '/')}/${paramCase(api.info.title)}/${api.info.version}`;
          if (!fs.existsSync(target) || !fs.lstatSync(target).isDirectory()) {
            mkdirp.sync(target);
          }

          // Copy zip
          const artifactName = path.parse(archive).name;
          fs.copyFileSync(archive, `${target}/${artifactName}.zip`);

          // Copy POM
          let pomContent = '<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">\n';
          pomContent += '\t<modelVersion>4.0.0</modelVersion>\n';
          pomContent += `\t<groupId>${config.groupId}</groupId>\n`;
          pomContent += `\t<artifactId>${paramCase(api.info.title)}</artifactId>\n`;
          pomContent += `\t<version>${api.info.version}</version>\n`;
          pomContent += '\t<packaging>zip</packaging>\n';
          pomContent += '</project>';

          fs.writeFileSync(`${target}/${artifactName}.pom`, pomContent);
        } catch (err) {
          console.error(
            colors.red(`The API file '${spec.file}' is invalid: ${err.message}`)
          );
          reject();
        }
      })
    );
  });

  return settle(promises);
}
