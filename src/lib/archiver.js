import { createWriteStream } from 'fs';
import archiver from 'archiver';
import path from 'path';
import { paramCase } from 'change-case';

import { getTempDir } from './utils';

// ##################################################################
// The aim of this file is to generate an archive file that
// contains the whole of OpenAPI files
// ##################################################################

export function generateSpecsArchive(api, apiFilename) {
  return new Promise(resolve => {
    const workDir = getTempDir();
    const zipOutput = createWriteStream(
      `${workDir.name}/${paramCase(api.info.title)}-${api.info.version}.zip`
    );
    const zip = archiver('zip');

    zip.pipe(zipOutput);
    zip.directory(path.dirname(apiFilename), '/');

    zip.finalize();

    zipOutput.on('close', () => resolve(
      `${workDir.name}/${paramCase(api.info.title)}-${api.info.version}.zip`
    ));
  });
}
