import { parseFolder } from './templater';
import SwaggerParser from 'swagger-parser';
import { isJSONFile, validateExamples } from './utils';
import path from 'path';
import YAML from 'yaml';
import fs from 'fs';
import { paramCase } from 'change-case';

/**
 * Bundle spec and return the associated OpenAPI Document
 * @param config input config containing path to specification files
 * @param spec specific specification to bundle
 * @returns {Promise<OpenAPIV2.Document|OpenAPIV3.Document>}
 */
export async function bundleSpec(config, spec) {
  // Apply EJS on specs folder
  const specsFolder = path.dirname(`${spec.file}`);
  const specsFolderTemplated = parseFolder(specsFolder, spec.context);
  if (config.verbose) {
    console.log(
      `OpenAPI files compiled in ${specsFolderTemplated.name} folder!`
    );
  }

  const filePath = path.join(
    specsFolderTemplated.name,
    path.basename(spec.file)
  );

  if (!fs.statSync(filePath)) {
    throw new Error(`OpenAPI specification file ${filePath} does not exist !`);
  }

  let api;
  if (!config.skipValidation) {
    await SwaggerParser.validate(filePath);
  }

  api = await SwaggerParser.bundle(filePath);
  if (!config.skipValidation) {
    await validateExamples(api);
  }

  if (!api.info) {
    throw new Error(
      `No "info" section in OpenAPI specification: ${JSON.stringify(api)}`
    );
  }

  // Check title and version syntax
  const titleRegex = /^[a-z\-0-9]+$/;
  if (!paramCase(api.info.title).match(titleRegex)) {
    throw new Error(
      `title \'${api.info.title}\' is not valid. Should be correct with ${titleRegex}`
    );
  }

  const versionRegex =
    /^((([0-9]+)\.([0-9]+)\.([0-9]+)(?:-([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?)(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?)$/;
  if (!api.info.version.match(versionRegex)) {
    throw new Error(
      `version \'${api.info.version}\' is not valid. Should be correct with ${versionRegex}`
    );
  }

  if (config.verbose) {
    console.log(`\tSpecification validated: ${paramCase(api.info.title)}`);
  }
  return api;
}

/**
 * Write the provided OpenAPI Document to the filesystem
 * @param outputDir output directory
 * @param outputFilename output file name
 * @param originalSpecFilename file as defined in configuration file
 * @param api {OpenAPIV2.Document|OpenAPIV3.Document} to write down
 * @return {string} the generated file path
 */
export function writeOpenApiDocumentToFile(
  outputDir,
  outputFilename,
  originalSpecFilename,
  api
) {
  const targetFile = path.join(outputDir, outputFilename);
  if (isJSONFile(originalSpecFilename)) {
    fs.writeFileSync(targetFile, JSON.stringify(api, null, 2));
  } else {
    fs.writeFileSync(targetFile, YAML.stringify(api, { schema: 'yaml-1.1' }));
  }
  return targetFile;
}
