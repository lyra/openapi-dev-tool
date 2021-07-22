import fs from 'fs';
import path from 'path';
import chai from 'chai';
import chaiString from 'chai-string';
import { bundleSpec, writeOpenApiDocumentToFile } from '../../src/lib/bundler';
import { getTempDir } from "../../src/lib/utils";

chai.use(chaiString);

const assert = chai.assert;

describe('bundler.js file', function () {
    describe('bundleSpec function', function () {
        it('should bundle spec multiple files to a model', async function () {
            const config = {
                config: { }
            };
            const spec = {
                file: `${__dirname}/../assets/spec-split/spec.yaml`,
                context: { label: 'value' },
            };
            const api = await bundleSpec(config, spec);
            assert.isNotNull(api);
            assert.equal("string", api.components.schemas.Model1.properties.attribute1.type);
            assert.equal("param1", api.components.parameters.Param1.name);
        });

        it('should write a bundled spec to file system which should be the same as original one', async function () {
            const outputDir = getTempDir().name;
            const outputFilename = 'spec-1-file.yaml';

            try {
                const originalConfig = {
                    config: { }
                };
                const originalSpec = { file: `${__dirname}/../assets/spec-split/spec.yaml` };
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

                assert.isTrue(fs.existsSync(path.join(outputDir, outputFilename)));

                // re-read the output file and ensure it matches the original parsed one
                const config2 = {
                    config: { }
                };
                const spec2 = {
                    file: `${outputDir}/${outputFilename}`
                };
                const api2 = await bundleSpec(config2, spec2);

                assert.deepEqual(originalApi, api2);
            } finally {
                fs.unlinkSync(path.join(outputDir, outputFilename));
                fs.rmdirSync(outputDir);
            }
        })
    });

    it('should accept correct version and refuse wrong ones', async function () {
        try {
            const api = await bundleSpec(
                { config: { } },
                { file: `${__dirname}/../assets/versions/long/specs-long-version.yaml` });
            assert.exists(api);
            assert.exists(api.info.version);
        } catch (error) {
            assert.fail('Could not parse long version in spec', error);
        }

        try {
            const api = await bundleSpec(
                { config: { } },
                { file: `${__dirname}/../assets/versions/wrong/specs-wrong-version.yaml` });
            assert.fail(`Did not fail with a wrong version: ${api.info.version} !!`);
        } catch (error) {
            // OK
            assert.exists(error);
            assert.isOk(error.message.startsWith('version') && error.message.includes(' is not valid. Should be correct with '));
        }
    });
});
