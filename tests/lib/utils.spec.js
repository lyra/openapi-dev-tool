import path from 'path';

import {
  isYAMLFile,
  isJSONFile,
  getTempDir,
  getPOMContent,
} from '../../src/lib/utils.js';

describe('utils.js file', () => {
  describe('isYAMLFile function', () => {
    it('should return true when the input ends with .yaml', () => {
      expect(isYAMLFile('file.yaml')).toBe(true);
    });

    it('should return true when the input ends with .yml', () => {
      expect(isYAMLFile('file.yaml')).toBe(true);
    });

    it('should return fase when the input ends with .json', () => {
      expect(isYAMLFile('file.json')).toBe(false);
    });
  });

  describe('isJSONFile function', () => {
    it('should return true when the input ends with .json', () => {
      expect(isJSONFile('file.json')).toBe(true);
    });

    it('should return false when the input ends with .yaml', () => {
      expect(isJSONFile('file.yaml')).toBe(false);
    });
  });

  describe('getTempDir function', () => {
    it("should start with 'openapi-dev-tool_'", () => {
      const tmp = getTempDir();
      expect(path.basename(tmp.name).startsWith('openapi-dev-tool_')).toBe(
        true
      );
    });
  });

  describe('getPOMContent function', () => {
    it('should return xml with artifact data', () => {
      const content = getPOMContent(
        'artifactId',
        'version',
        'groupId',
        'packaging'
      );

      let expected =
        '<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">\n';
      expected += '\t<modelVersion>4.0.0</modelVersion>\n';
      expected += `\t<groupId>groupId</groupId>\n`;
      expected += `\t<artifactId>artifactId</artifactId>\n`;
      expected += `\t<version>version</version>\n`;
      expected += `\t<packaging>packaging</packaging>\n`;
      expected += '</project>';

      expect(content).toEqual(expected);
    });
  });
});
