import path from 'path';
import fs from 'fs';
import colors from 'colors';
import YAML from 'yaml';

import { parseFolder } from './templater';
import { isJSONFile } from './utils';
import { bundleSpec } from './bundler';

// ##################################################################
// This file has to expose API files:
// - in bundle way: where the whole of OpenAPI files are merged into one
// - in original way: no change is done on OpenAPI files
//
// Before to expose specs, we have to parse with EJS engine
// to generate specs in specifics contexts
// ##################################################################

// Cache is used to avoid to reconstruct bundle for each call
let cache = {};

// Send to express response a content with correct Content-Type header
function send(spec, body, res) {
  if (isJSONFile(spec.file)) {
    res.json(body);
  } else {
    res.set('Content-Type', 'text/yaml').send(body);
  }
}

export default function middleware(config, specs) {
  return {
    // To be able to update new specs (after change)
    updateSpecs: (newSpecs) => {
      specs = newSpecs;

      // Invalidate cache
      cache = {};
    },
    // Express middleware to expose API bundled
    bundle: async (req, res, next) => {
      const spec = specs.find((spec) => {
        return spec.name === req.params.specName;
      });

      if (spec) {
        try {
          // Check if cache exists
          if (cache[spec.name]) {
            send(spec, cache[spec.name], res);
          } else {
            const api = await bundleSpec(config, spec);

            let bundle;
            if (isJSONFile(spec.file)) {
              bundle = api;
            } else {
              bundle = YAML.stringify(api, { schema: 'yaml-1.1' });
            }

            // Complete cache
            cache[spec.name] = bundle;

            send(spec, bundle, res);
          }
        } catch (err) {
          console.error(
            colors.red(`The API file '${spec.file}' is invalid: ${err.message}`)
          );
          next();
        }
      } else {
        next();
      }
    },
    // Express middleware to expose API original
    original: (req, res, next) => {
      const spec = specs.find((spec) => {
        return spec.name === req.params.specName;
      });
      if (spec) {
        const specsFolder = path.dirname(`${spec.file}`);
        const specsFolderTemplated = parseFolder(specsFolder, spec.context);
        if (config.verbose) {
          console.log(
            `OpenAPI files compiled in ${specsFolderTemplated.name} folder!`
          );
        }
        const content = fs.readFileSync(
          `${specsFolderTemplated.name}/${req.params[0]}`,
          'utf-8'
        );
        send(spec, content, res);
      } else {
        next();
      }
    },
  };
}
