import fs from 'fs';
import ejs from 'ejs';
import mkdirp from 'mkdirp';

import { isJSONFile, isYAMLFile, getTempDir } from './utils.js';

// ##################################################################
// This file allows to apply EJS template engine on folder or a file
// ##################################################################

export function parseFile(path, context) {
  let body = fs.readFileSync(path, 'utf-8');
  // Apply EJS engine
  const template = ejs.compile(body);
  return template(context);
}

export function parseFolder(path, context, initialPath, destFolder) {
  const content = fs.readdirSync(path);
  if (!destFolder) {
    destFolder = getTempDir();
  }
  if (!initialPath) {
    initialPath = '/';
  }
  content.forEach((file) => {
    const stats = fs.statSync(`${path}/${file}`);
    // If it is a directory, we call again (recursively)
    if (stats.isDirectory()) {
      parseFolder(
        `${path}/${file}`,
        context,
        `${initialPath}/${file}`,
        destFolder
      );
    } else {
      // Is a file, we have to use ejs
      if (isJSONFile(file) || isYAMLFile(file)) {
        mkdirp.sync(`${destFolder.name}/${initialPath}`);
        fs.writeFileSync(
          `${destFolder.name}/${initialPath}/${file}`,
          parseFile(`${path}/${file}`, context)
        );
      }
    }
  });
  return destFolder;
}
