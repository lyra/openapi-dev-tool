import path from 'path';

import chai from 'chai';
import chaiString from 'chai-string';
import { paramCase } from 'change-case';
import { generateSpecsArchive } from '../../src/lib/archiver';

chai.use(chaiString);

const assert = chai.assert;

describe('archiver.js file', function() {
  describe('generateSpecsArchive function', function() {
    it('should return a archive file when the input is correct', async function() {
      const api = {
        info: {
          version: '1.0.0',
          title: 'title',
        },
      };
      const res = await generateSpecsArchive(api, '/dir/file.yaml');
      assert.equal(
        `title-1.0.0.zip`,
        path.basename(res)
      );
    });

    it('should return a archive file when the title seems incorrect', async function() {
      const api = {
        info: {
          version: '1.0.0',
          title: 'My title',
        },
      };
      const res = await generateSpecsArchive(api, '/dir/file.yaml');
      assert.equal(
        `my-title-1.0.0.zip`,
        path.basename(res)
      );
    });
  });
});
