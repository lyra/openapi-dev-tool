import path from 'path';

import { generateSpecsArchive } from '../../src/lib/archiver.js';

describe('archiver.js file', () => {
  describe('generateSpecsArchive function', () => {
    it('should return a archive file when the input is correct', async () => {
      const api = {
        info: {
          version: '1.0.0',
          title: 'title',
        },
      };
      const res = await generateSpecsArchive(api, '/dir/file.yaml');
      expect(path.basename(res)).toBe('title-1.0.0.zip');
    });

    it('should return a archive file when the title seems incorrect', async () => {
      const api = {
        info: {
          version: '1.0.0',
          title: 'My title',
        },
      };
      const res = await generateSpecsArchive(api, '/dir/file.yaml');
      expect(path.basename(res)).toBe('my-title-1.0.0.zip');
    });
  });
});
