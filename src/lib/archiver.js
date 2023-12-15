import { createWriteStream } from 'fs';
import archiver from 'archiver';
import path from 'path';
import { paramCase } from 'change-case';

import { getTempDir } from './utils.js';

// ##################################################################
// The aim of this file is to generate an archive file that
// contains the whole of OpenAPI files
// ##################################################################

export function generateSpecsArchive(api, apiFilename, repoType) {
  return new Promise((resolve) => {
    const workDir = getTempDir();
    const fileResult =
      repoType === 'maven'
        ? `${workDir}/${paramCase(api.info.title)}-${api.info.version}.zip`
        : `${workDir}/${paramCase(api.info.title)}-${api.info.version}.tar`;
    const zipOutput = createWriteStream(fileResult);
    const zip =
      repoType === 'maven' ? archiver('zip') : archiver('tar', { gzip: true });

    zip.pipe(zipOutput);
    zip.directory(
      path.dirname(apiFilename),
      repoType === 'maven' ? '/' : 'package'
    );

    zip.finalize();

    zipOutput.on('close', () => resolve(fileResult));
  });
}
