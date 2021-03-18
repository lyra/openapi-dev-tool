import path from 'path';

import chai from 'chai';
import chaiString from 'chai-string';
import { isYAMLFile, isJSONFile, getTempDir, getPOMContent } from '../../src/lib/utils';

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

  describe('getPOMContent function', function() {
    it("should return xml with artifact data", function() {
      const content = getPOMContent('artifactId', 'version', 'groupId', 'packaging');

      let expected = '<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">\n';
      expected += '\t<modelVersion>4.0.0</modelVersion>\n';
      expected += `\t<groupId>groupId</groupId>\n`;
      expected += `\t<artifactId>artifactId</artifactId>\n`;
      expected += `\t<version>version</version>\n`;
      expected += `\t<packaging>packaging</packaging>\n`;
      expected += '</project>';

      assert.equal(content, expected);
    });
  });
});
