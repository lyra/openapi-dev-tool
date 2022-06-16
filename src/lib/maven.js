import { execSync } from 'child_process';
import fs from 'fs';
import commandExists from 'command-exists';

export const mavenCommand = 'mvn';

const mavenLocalPathCmd = `${mavenCommand} help:evaluate -Dexpression=settings.localRepository -q -DforceStdout`;

const mavenDownloadCmd = `${mavenCommand} dependency:unpack -Dartifact=<ARTIFACT>:zip -DoutputDirectory=.`;

export function mvnExists() {
  return commandExists.sync(mavenCommand);
}

export function getRepoPath() {
  return execSync(mavenLocalPathCmd).toString();
}

export function downloadArtifact(artifact, verbose) {
  // We download it in specific folder to avoid downloading if already here
  const folder = `.specs/${artifact}`;
  // If folder is already exist , we use cache
  if (fs.existsSync(folder)) {
    if (verbose)
      console.log(
        `Use specs of artifact '${artifact}' from cache ('${folder}')!`
      );
    return folder;
  }
  if (!mvnExists()) throw new Error(`'${mavenCommand}' command does not exist`);
  fs.mkdirSync(folder, { recursive: true });
  execSync(
    mavenDownloadCmd
      .replace(/<ARTIFACT>/, artifact)
      .replace(/<OUTPUT>/g, folder),
    { cwd: folder }
  );

  return folder;
}
