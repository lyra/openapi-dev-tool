import { loadSpecs } from '../../src/lib/specs.js';

describe('specs.js file', () => {
  describe('loadSpecs function', () => {
    it('should return a correct object', async () => {
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
      expect(specs.length).toBe(1);
      expect(specs[0].context).toEqual({ label: 'value' });
      expect(specs[0].tags).toEqual(['toto', 'tata']);
      expect(specs[0].name).toBe('petstore');
      expect(specs[0].description).toBe('<p>description</p>');
      expect(specs[0].version).toBe('1.0.0');
      expect(specs[0].file).toEqual(expect.stringContaining('specs.yaml'));
    });

    it('should return an empty array if specs is not enabled', async () => {
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
      expect(specs.length).toBe(0);
    });
  });
});
