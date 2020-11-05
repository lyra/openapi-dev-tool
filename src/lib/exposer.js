import path from 'path';
import fs from 'fs';
import SwaggerParser from 'swagger-parser';
import YAML from 'yaml';

import { parseFolder } from './templater';
import { isJSONFile } from './utils';

// ##################################################################
// This file has to expose API files:
// - in bundle way: where the whole of OpenAPI files are merged into one
// - in original way: no change is done on OpenAPI files
//
// Before to expose specs, we have to parse with EJS engine
// to generate specs in specifics contexts
// ##################################################################

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
    updateSpecs: newSpecs => {
      specs = newSpecs;
    },
    // Express middleware to expose API bundled
    bundle: async (req, res, next) => {
      const spec = specs.find(spec => {
        return spec.name === req.params.specName;
      });

      if (spec) {
        // Here, we have to apply ejs in complete folder
        // Before bundling with SwaggerParser
        const specsFolder = path.dirname(
          `${config.config.folder}/${spec.file}`
        );
        const specsFolderTemplated = parseFolder(specsFolder, spec.context);
        if (config.verbose) {
          console.log(
            `OpenAPI files compiled in ${specsFolderTemplated.name} folder!`
          );
        }
        let api = await SwaggerParser.bundle(
          specsFolderTemplated.name + '/' + path.basename(spec.file)
        );
        let bundle;
        if (isJSONFile(spec.file)) {
          bundle = JSON.stringify(api, null, 2);
        } else {
          bundle = YAML.stringify(api, { schema: 'yaml-1.1' });
        }

        send(spec, bundle, res);
      } else {
        next();
      }
    },
    // Express middleware to expose API original
    original: (req, res, next) => {
      const spec = specs.find(spec => {
        return spec.name === req.params.specName;
      });
      if (spec) {
        const specsFolder = path.dirname(
          `${config.config.folder}/${spec.file}`
        );
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
