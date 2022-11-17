import fs from 'fs';

import chai from 'chai';
import chaiString from 'chai-string';
import { parseFile, parseFolder } from '../../src/lib/templater.js';

chai.use(chaiString);

const assert = chai.assert;

describe('templater.js file', function () {
  describe('parseFile function', function () {
    it('should return a correct content', async function () {
      const content = parseFile('./tests/assets/test.yaml', {
        label: 'value',
      });
      assert.equal('value', content);
    });
  });

  describe('parseFolder function', function () {
    it('should return a correct content', async function () {
      const folder = parseFolder('./tests/assets', {
        label: 'value',
      });

      let content = fs.readFileSync(`${folder.name}/test.yaml`, 'UTF-8');
      assert.equal('value', content);

      content = fs.readFileSync(`${folder.name}/sub-assets/test.yaml`, 'UTF-8');
      assert.equal('value', content);
    });
  });
});
