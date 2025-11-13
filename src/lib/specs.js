import showdown from 'showdown';
import YAML from 'yaml';
import path from 'path';

import { parseFile } from './templater.js';
import { isJSONFile } from './utils.js';

// ##################################################################
// This file construct specs objects with:
// - name
// - version
// - description
// - url (for bundle or original mode)
// - file
// - context (for EJS parsing)
// - tags
// ##################################################################

// To generate Markdown syntax to HTML (for displaying API description)
const converter = new showdown.Converter();

export function loadSpecs(config) {
  // We filter to work only on enabled specs
  const specsPromises = config.config.specs
    .filter((spec) => spec.enabled)
    .filter((spec) => {
      // Apply filter if it is defined
      let api;
      let raw = parseFile(spec.file, spec.context);
      if (isJSONFile(spec.file)) {
        api = JSON.parse(raw, null, 2);
      } else {
        api = YAML.parse(raw);
      }
      if (config.filter && api.info.title !== config.filter) {
        console.log("\tspec '%s': ignored by filter", api.info.title);
        return false;
      }
      spec.api = api;
      return true;
    })
    .map(async (spec) => {
      return await {
        name: spec.api.info.title,
        version: spec.api.info.version,
        description: converter.makeHtml(spec.api.info.description),
        url: !config.skipBundle
          ? `./raw/bundle/${encodeURIComponent(spec.api.info.title)}.${
              isJSONFile(spec.file) ? 'json' : 'yaml'
            }`
          : `./raw/original/${encodeURIComponent(
              spec.api.info.title
            )}/${path.basename(spec.file)}`,
        file: spec.file,
        context: spec.context,
        vFolders: spec.vFolders,
        tags: spec.api.info['x-tags'] || [],
      };
    });

  return Promise.all(specsPromises);
}
