import { execSync } from 'child_process';
import rimraf from 'rimraf';
import fs from 'fs';
import commandExists from 'command-exists';
import AdmZip from 'adm-zip';
import maven from 'maven';

import { downloadFile } from './utils.js';

export const mavenCommand = 'mvn';

const mavenLocalPathCmd = `${mavenCommand} help:evaluate -Dexpression=settings.localRepository -q -DforceStdout`;

export function mvnExists() {
  return commandExists.sync(mavenCommand);
}

export function getRepoPath() {
  return execSync(mavenLocalPathCmd).toString();
}

export function downloadArtifact(artifact, urlDownloadTemplate, verbose) {
  return new Promise((resolve, reject) => {
    // We download it in specific folder to avoid downloading if already here
    const folder = `.specs/${artifact}`;
    // If folder is already exist , we use cache
    if (fs.existsSync(folder)) {
      if (verbose) console.log(`Use specs of artifact '${artifact}' in cache!`);
      resolve(folder);
      return;
    }
    if (verbose) console.log(`Downloading artifact '${artifact}'...`);

    // Check valid url download template
    if (!urlDownloadTemplate) {
      reject(new Error(`Option 'urlDownloadTemplate' has to be defined`));
      return;
    } else {
      if (!urlDownloadTemplate.match(/^http[s]?/)) {
        reject(
          new Error(
            `Option 'urlDownloadTemplate' doesn\'t have a valid syntax url`
          )
        );
        return;
      } else {
        if (
          !urlDownloadTemplate.match(/\[ARTIFACT_ID\]/) ||
          !urlDownloadTemplate.match(/\[GROUP_ID\]/) ||
          !urlDownloadTemplate.match(/\[VERSION\]/)
        ) {
          reject(
            new Error(
              `Option 'urlDownloadTemplate' has to contain token [ARTIFACT_ID], [GROUP_ID] and [VERSION]`
            )
          );
          return;
        }
      }
    }

    // Folder does not exist, we have to download spec archive
    fs.mkdirSync(folder, { recursive: true });
    const artifactParts = artifact.split(':');

    const url = urlDownloadTemplate
      .replace(/\[ARTIFACT_ID\]/g, artifactParts[1])
      .replace(/\[GROUP_ID\]/g, artifactParts[0])
      .replace(/\[VERSION\]/g, artifactParts[2]);

    return downloadFile(url, `${folder}/archive.zip`)
      .then(() => {
        const zip = new AdmZip(`${folder}/archive.zip`);
        zip.extractAllTo(folder, true);
        resolve(folder);
      })
      .catch((err) => {
        if (fs.existsSync(`${folder}`)) rimraf.sync(`${folder}`);
        reject(err);
      });
  });
}

export async function installToLocalRepository(archive, pomFile) {
  const mvnInstance = maven.create({ quiet: true });
  await mvnInstance.execute(['install:install-file'], {
    file: archive,
    pomFile: pomFile,
  });
}
