import fs from 'fs';

import { parseFile, parseFolder } from '../../src/lib/templater.js';

describe('templater.js file', () => {
  describe('parseFile function', () => {
    it('should return a correct content', async () => {
      const content = parseFile('./tests/assets/test.yaml', {
        label: 'value',
      });
      expect(content).toBe('value');
    });
  });

  describe('parseFolder function', () => {
    it('should return a correct content', async () => {
      const folder = parseFolder('./tests/assets', {
        label: 'value',
      });

      let content = fs.readFileSync(`${folder.name}/test.yaml`, 'UTF-8');
      expect(content).toBe('value');

      content = fs.readFileSync(`${folder.name}/sub-assets/test.yaml`, 'UTF-8');
      expect(content).toBe('value');
    });
  });
});
