import path from 'path';
import StreamZip from 'node-stream-zip';
import StreamTar from 'tar-stream';
import fs from 'fs';
import zlib from 'node:zlib';

import { generateSpecsArchive } from '../../src/lib/archiver.js';

describe('archiver.js file', () => {
  describe('generateSpecsArchive function', () => {
    it('should return a zip archive file when the input is correct', async () => {
      const api = {
        info: {
          version: '1.0.0',
          title: 'title',
        },
      };
      const res = await generateSpecsArchive(
        api,
        ['./tests/assets/specs.yaml'],
        'maven'
      );
      const zip = new StreamZip({
        file: res,
        storeEntries: true,
      });
      zip.on('ready', () => {
        expect(zip.entriesCount).toBe(1);
        expect(Object.values(zip.entries())[0].name).toBe('specs.yaml');
        expect(path.basename(res)).toBe('title-1.0.0.zip');
        zip.close();
      });
    });

    it('should return a tar archive file when the input is correct', async () => {
      const api = {
        info: {
          version: '1.0.0',
          title: 'title',
        },
      };
      const res = await generateSpecsArchive(
        api,
        ['./tests/assets/specs.yaml'],
        'npm'
      );
      const extract = StreamTar.extract();
      fs.createReadStream(res).pipe(zlib.createGunzip()).pipe(extract);
      extract.on('entry', function (header, stream, next) {
        expect(header.name).toBe('package/specs.yaml');
        expect(next()).toBe(undefined);
        expect(path.basename(res)).toBe('title-1.0.0.tar');
      });
    });

    it('should return a archive file when the title seems incorrect', async () => {
      const api = {
        info: {
          version: '1.0.0',
          title: 'My title',
        },
      };
      const res = await generateSpecsArchive(api, ['/dir/file.yaml'], 'maven');
      expect(path.basename(res)).toBe('my-title-1.0.0.zip');
    });
  });
});
