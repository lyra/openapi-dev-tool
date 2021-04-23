import path, { dirname } from 'path';
import fs from 'fs';

import chai from 'chai';
import chaiString from 'chai-string';
import { loadSpecs } from '../../src/lib/specs';

chai.use(chaiString);

const assert = chai.assert;

describe('specs.js file', function() {
  describe('loadSpecs function', function() {
    it('should return a correct object', async function() {
      const specs = await loadSpecs({
        config: {
          folder: `${__dirname}/../assets`,
          specs: [{ file: 'specs.yaml', context: { label: 'value' } }],
        },
      });
      assert.deepEqual(
        [
          {
            name: 'petstore',
            version: '1.0.0',
            description: '<p>description</p>',
            url: '/raw/bundle/petstore.yaml',
            file: 'specs.yaml',
            context: { label: 'value' },
            tags: ['toto', 'tata'],
          },
        ],
        specs
      );
    });
  });
});
