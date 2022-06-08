import { execSync } from 'child_process';
import tmp from 'tmp';
import commandExists from 'command-exists';

const mavenLocalPathCmd =
  'mvn help:evaluate -Dexpression=settings.localRepository -q -DforceStdout';

const mavenDownloadCmd =
  'mvn dependency:unpack -Dartifact=<ARTIFACT>:zip -DoutputDirectory=.';

export function mvnExists() {
  return commandExists.sync('mvn');
}

export function getRepoPath() {
  return execSync(mavenLocalPathCmd).toString();
}

export function downloadArtifact(artifact) {
  const folder = tmp.dirSync({
    prefix: 'openapi-dev-tool_',
    unsafeCleanup: true,
  });
  execSync(
    mavenDownloadCmd
      .replace(/<ARTIFACT>/, artifact)
      .replace(/<OUTPUT>/g, folder.name),
    { cwd: folder.name }
  );

  return folder.name;
}
