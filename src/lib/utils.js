import path from 'path';
import tmp from 'tmp';
import validator from 'openapi-examples-validator';

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
  //const result = await validateFile(targetFile);

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

    // We have to change api to be able to validates the whole of examples (with inheritance)
    // 1. Replace mapping property by oneOf array
    // 2. Remove allOf of subSchema
    // 3. Add value of discriminator propertyName
    Object.keys(apiPart).forEach(function(key) {
      if (key === 'discriminator' && apiPart[key].mapping && apiPart[key].propertyName && !apiPart.oneOf) {
        let propertyName = apiPart[key].propertyName;

        apiPart.oneOf = [];
        Object.keys(apiPart[key].mapping).forEach(function(mapper) {
          let xpath = apiPart[key].mapping[mapper].replace(/^#\//, '').replace(/\//g, '.');
          
          let subSchema = goDeep(apiCloned, xpath);

          // if ref is defined
          if (subSchema) {
            // Replace mapping by oneOf array
            apiPart.oneOf.push({'$ref': apiPart[key].mapping[mapper]})
            
            // Remove allOf of subSchema
            if (subSchema.allOf) {
              subSchema.allOf = subSchema.allOf.filter(item => item.$ref && !item.$ref.match(nodePath))
              subSchema.allOf.push({ type: 'object', properties: {[propertyName]: { type: 'string', enum: [mapper] }} })
              Object.assign(subSchema, ...subSchema.allOf);
              delete subSchema.allOf;
            } else {
              if (subSchema.type === 'object') {
                subSchema.properties = {[propertyName]: { type: 'string', enum: [mapper] }}
              }
            }
          }
        });
        // Remove mapping property
        delete apiPart[key].mapping;
      }
      if (typeof apiPart[key] === 'object') transform(apiPart[key], nodePath + '/'+ key)
    });
  }

  transform(apiCloned, "");

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
