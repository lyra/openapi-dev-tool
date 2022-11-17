import chai from 'chai';
import chaiString from 'chai-string';
import { loadSpecs } from '../../src/lib/specs.js';

chai.use(chaiString);

const assert = chai.assert;

describe('specs.js file', function () {
  describe('loadSpecs function', function () {
    it('should return a correct object', async function () {
      const specs = await loadSpecs({
        config: {
          specs: [
            {
              file: `./tests/assets/specs.yaml`,
              context: { label: 'value' },
              enabled: true,
            },
          ],
        },
      });
      assert.equal(1, specs.length);
      assert.deepEqual({ label: 'value' }, specs[0].context);
      assert.deepEqual(['toto', 'tata'], specs[0].tags);
      assert.equal('petstore', specs[0].name);
      assert.equal('<p>description</p>', specs[0].description);
      assert.equal('1.0.0', specs[0].version);
      assert.equal('1.0.0', specs[0].version);
      assert.include(specs[0].file, 'specs.yaml');
    });

    it('should return an empty array if specs is not enabled', async function () {
      const specs = await loadSpecs({
        config: {
          specs: [
            {
              file: `./tests/assets/specs.yaml`,
              context: { label: 'value' },
              enabled: false,
            },
          ],
        },
      });
      assert.equal(0, specs.length);
    });
  });
});
