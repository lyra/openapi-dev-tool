import { createWriteStream } from 'fs';
import archiver from 'archiver';
import path from 'path';
import { paramCase } from 'change-case';

import { getTempDir } from './utils.js';

// ##################################################################
// The aim of this file is to generate an archive file that
// contains the whole of OpenAPI files
// ##################################################################

export function generateSpecsArchive(api, files, repoType) {
  return new Promise((resolve) => {
    const workDir = getTempDir();
    // For maven, we generate a zip file
    // For npm, we generate a tar file
    const fileResult =
      repoType === 'maven'
        ? `${workDir.name}/${paramCase(api.info.title)}-${api.info.version}.zip`
        : `${workDir.name}/${paramCase(api.info.title)}-${
            api.info.version
          }.tar`;
    const zipOutput = createWriteStream(fileResult);
    const zip =
      repoType === 'maven' ? archiver('zip') : archiver('tar', { gzip: true });

    zip.pipe(zipOutput);
    if (files && files.length > 0) {
      files.forEach((element) => {
        zip.file(element, {
          name:
            repoType === 'maven' ? '/' : 'package/' + path.basename(element),
        });
      });
    }

    zip.finalize();

    zipOutput.on('close', () => resolve(fileResult));
  });
}
