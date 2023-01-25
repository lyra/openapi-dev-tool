import SwaggerParser from '@apidevtools/swagger-parser';
import path from 'path';
import tmp from 'tmp';
import https from 'https';
import fs from 'fs';
import validator from '../openapi-examples-validator/dist/index.js';

// ##################################################################
// The aim of this file is exposed several utils functions
// ##################################################################

tmp.setGracefulCleanup();

export function isYAMLFile(filename) {
  return (
    path.extname(filename) === '.yml' || path.extname(filename) === '.yaml'
  );
}

export function isJSONFile(filename) {
  return path.extname(filename) === '.json';
}

export function getTempDir() {
  return tmp.dirSync({ prefix: 'openapi-dev-tool_', unsafeCleanup: true });
}

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

export function getAppVersion() {
  return JSON.parse(
    fs.readFileSync(new URL('../../package.json', import.meta.url))
  ).version;
}

export function downloadFile(url, targetFile) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (response) => {
        const code = response.statusCode;

        if (code >= 400) {
          return reject(new Error(response.statusMessage));
        }

        // handle redirects
        if (code > 300 && code < 400 && !!response.headers.location) {
          return downloadFile(response.headers.location, targetFile).then(
            resolve
          );
        }

        // save the file to disk
        const fileWriter = fs.createWriteStream(targetFile).on('finish', () => {
          fileWriter.close();
          resolve();
        });

        response.pipe(fileWriter);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}

export function getPOMContent(artifactId, version, groupId, packaging) {
  let pomContent =
    '<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">\n';
  pomContent += '\t<modelVersion>4.0.0</modelVersion>\n';
  pomContent += `\t<groupId>${groupId}</groupId>\n`;
  pomContent += `\t<artifactId>${artifactId}</artifactId>\n`;
  pomContent += `\t<version>${version}</version>\n`;
  pomContent += `\t<packaging>${packaging}</packaging>\n`;
  pomContent += '</project>';

  return pomContent;
}

export async function validateExamples(api) {
  // We clone because, api should be transform for validation
  const apiCloned = JSON.parse(JSON.stringify(api));

  function transform(apiPart, nodePath) {
    function goDeep(obj, path) {
      var parts = path.split('.'),
        rv,
        index;
      for (rv = obj, index = 0; rv && index < parts.length; ++index) {
        rv = rv[parts[index]];
      }
      return rv;
    }

    function isObject(item) {
      return item && typeof item === 'object' && !Array.isArray(item);
    }

    /**
     * Deep merge two objects.
     * @param target
     * @param ...sources
     */
    function mergeDeep(target, ...sources) {
      if (!sources.length) return target;
      const source = sources.shift();

      if (isObject(target) && isObject(source)) {
        for (const key in source) {
          if (isObject(source[key])) {
            if (!target[key]) Object.assign(target, { [key]: {} });
            mergeDeep(target[key], source[key]);
          } else {
            Object.assign(target, { [key]: source[key] });
          }
        }
      }

      return mergeDeep(target, ...sources);
    }

    // We have to change api to be able to validates the whole of examples (with inheritance)
    // 1. Replace mapping property by oneOf array
    // 2. Remove allOf of subSchema
    // 3. Add value of discriminator propertyName
    Object.keys(apiPart).forEach(function (key) {
      if (
        key === 'discriminator' &&
        apiPart[key].mapping &&
        apiPart[key].propertyName &&
        !apiPart.oneOf
      ) {
        let propertyName = apiPart[key].propertyName;

        apiPart.oneOf = [];
        Object.keys(apiPart[key].mapping).forEach(function (mapper) {
          let xpath = apiPart[key].mapping[mapper]
            .replace(/^#\//, '')
            .replace(/\//g, '.');

          let subSchema = goDeep(apiCloned, xpath);

          // if ref is defined
          if (subSchema) {
            // Replace mapping by oneOf array
            apiPart.oneOf.push({ $ref: apiPart[key].mapping[mapper] });

            // Remove allOf of subSchema
            if (subSchema.allOf) {
              subSchema.allOf = subSchema.allOf.filter(
                (item) => !item.$ref || !item.$ref.match(nodePath)
              );
              subSchema.allOf.push({
                type: 'object',
                properties: {
                  [propertyName]: { type: 'string', enum: [mapper] },
                },
              });
              mergeDeep(subSchema, ...subSchema.allOf);
              delete subSchema.allOf;
            } else {
              if (subSchema.type === 'object') {
                if (!subSchema.properties) subSchema.properties = {};
                subSchema.properties[propertyName] = {
                  type: 'string',
                  enum: [mapper],
                };
              }
            }
          }
        });
        // Remove mapping property
        delete apiPart[key].mapping;
      }
      if (typeof apiPart[key] === 'object')
        transform(apiPart[key], nodePath + '/' + key);
    });
  }

  transform(apiCloned, '');

  // Validate again to find some circular reference
  await SwaggerParser.validate(apiCloned, { dereference: { circular: false } });

  const result = await validator.default(apiCloned);

  if (!result.valid) {
    const errors = {};
    result.errors.forEach((error) => {
      if (!errors[error.examplePath]) errors[error.examplePath] = [];
      let errorMsg = '';
      if (error.dataPath) errorMsg += `'${error.dataPath}': `;
      if (error.instancePath)
        errorMsg += `'${error.instancePath.replace(/^\//, '')}': `;
      errorMsg += `${error.message}`;
      if (error.params && error.params.allowedValues)
        errorMsg += ` (${error.params.allowedValues})`;
      errors[error.examplePath].push(errorMsg);
    });
    let errorsMsg = '';
    Object.keys(errors).forEach((path) => {
      errorsMsg += `\nFrom '${path}':`;
      errors[path].forEach((error) => {
        errorsMsg += `\n\t- ${error}`;
      });
    });
    throw new Error(`some examples are invalid: ${errorsMsg}`);
  }
}
