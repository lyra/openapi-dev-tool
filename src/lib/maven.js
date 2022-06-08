import { execSync } from 'child_process';
import tmp from 'tmp';

const mavenLocalPathCmd =
  'mvn help:evaluate -Dexpression=settings.localRepository -q -DforceStdout';

const mavenDownloadCmd =
  'mvn dependency:unpack -Dartifact=<ARTIFACT>:zip -DoutputDirectory=<OUTPUT>';

export function getRepoPath() {
  return execSync(mavenLocalPathCmd).toString();
}

export function downloadArtifact(artifact) {
  const folder = tmp.dirSync({
    prefix: 'openapi-dev-tool_',
    unsafeCleanup: true,
  });
  console.log(
    mavenDownloadCmd
      .replace(/<ARTIFACT>/, artifact)
      .replace(/<OUTPUT>/, folder.name)
  );
  console.log(
    execSync(
      mavenDownloadCmd
        .replace(/<ARTIFACT>/, artifact)
        .replace(/<OUTPUT>/, folder.name)
    ).toString()
  );

  return folder.name;
}
