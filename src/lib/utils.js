import path from 'path';
import tmp from 'tmp';

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
