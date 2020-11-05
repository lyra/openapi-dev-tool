import path from 'path';

import chai from 'chai';
import chaiString from 'chai-string';
import { isYAMLFile, isJSONFile, getTempDir } from '../../src/lib/utils';

chai.use(chaiString);

const assert = chai.assert;

describe('utils.js file', function() {
  describe('isYAMLFile function', function() {
    it('should return true when the input ends with .yaml', function() {
      assert.isTrue(isYAMLFile('file.yaml'));
    });

    it('should return true when the input ends with .yml', function() {
      assert.isTrue(isYAMLFile('file.yml'));
    });

    it('should return fase when the input ends with .json', function() {
      assert.isFalse(isYAMLFile('file.json'));
    });
  });

  describe('isJSONFile function', function() {
    it('should return true when the input ends with .json', function() {
      assert.isTrue(isJSONFile('file.json'));
    });

    it('should return false when the input ends with .yaml', function() {
      assert.isFalse(isJSONFile('file.yaml'));
    });
  });

  describe('getTempDir function', function() {
    it("should start with 'openapi-dev-tool_'", function() {
      const tmp = getTempDir();
      assert.startsWith(path.basename(tmp.name), 'openapi-dev-tool_');
    });
  });
});
