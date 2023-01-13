import fs from 'fs';
import path from 'path';
import {
  bundleSpec,
  writeOpenApiDocumentToFile,
} from '../../src/lib/bundler.js';
import { getTempDir } from '../../src/lib/utils.js';

describe('bundler.js file', () => {
  describe('bundleSpec function', () => {
    it('should bundle spec multiple files to a model', async () => {
      const config = {
        config: {},
      };
      const spec = {
        file: `./tests/assets/spec-split/spec.yaml`,
        context: { label: 'value' },
      };
      const api = await bundleSpec(config, spec);
      expect(api).not.toBeNull();
      expect(api.components.schemas.Model1.properties.attribute1.type).toBe(
        'string'
      );
      expect(api.components.parameters.Param1.name).toBe('param1');
    });

    it('should write a bundled spec to file system which should be the same as original one', async () => {
      const outputDir = getTempDir().name;
      const outputFilename = 'spec-1-file.yaml';

      try {
        const originalConfig = {
          config: {},
        };
        const originalSpec = {
          file: `./tests/assets/spec-split/spec.yaml`,
        };
        const originalApi = await bundleSpec(originalConfig, originalSpec);

        if (!fs.existsSync(outputDir)) {
          fs.mkdirSync(outputDir);
        }
        writeOpenApiDocumentToFile(
          outputDir,
          outputFilename,
          `spec.yaml`,
          originalApi
        );

        expect(fs.existsSync(path.join(outputDir, outputFilename))).toBe(true);

        // re-read the output file and ensure it matches the original parsed one
        const config2 = {
          config: {},
        };
        const spec2 = {
          file: `${outputDir}/${outputFilename}`,
        };
        const api2 = await bundleSpec(config2, spec2);

        expect(api2).toEqual(originalApi);
      } finally {
        fs.unlinkSync(path.join(outputDir, outputFilename));
        fs.rmdirSync(outputDir);
      }
    });
  });

  it('should accept correct version and refuse wrong ones', async () => {
    try {
      const api = await bundleSpec(
        { config: {} },
        { file: `./tests/assets/versions/long/specs-long-version.yaml` }
      );
      expect(api).not.toBeNull();
      expect(api.info.version).not.toBeNull();
    } catch (error) {
      throw error;
    }

    try {
      const api = await bundleSpec(
        { config: {} },
        {
          file: `./tests/assets/versions/wrong/specs-wrong-version.yaml`,
        }
      );
      throw new Error(
        `Did not fail with a wrong version: ${api.info.version} !!`
      );
    } catch (error) {
      // OK
      expect(error).not.toBeNull();
      expect(
        error.message.startsWith('version') &&
          error.message.includes(' is not valid. Should be correct with ')
      ).toBe(true);
    }
  });
});
