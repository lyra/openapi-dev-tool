import path from 'path';
import tmp from 'tmp';
import { validateFile } from 'openapi-examples-validator';

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

export async function validateExamples(targetFile) {
  const result = await validateFile(targetFile);
  if (!result.valid) {
    const errors = {};
    result.errors.forEach((error) => {
      if (!errors[error.examplePath]) errors[error.examplePath] = [];
      let errorMsg = '';
      if (error.dataPath) errorMsg += `'${error.dataPath}': `;
      errorMsg += `${error.message}`;

      if (error.params.allowedValues)
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
