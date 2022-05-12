const _ = require("lodash");
const { lstat, access, readFile } = require("fs/promises");

async function fetchRecursively(awsClient, fetchOptions = {}, payload = {}) {
  const methodPayload = { ...payload };
  if (fetchOptions.nextToken) {
    methodPayload.nextToken = fetchOptions.nextToken;
  }

  const fetchResult = await awsClient[fetchOptions.methodName](methodPayload).promise();
  const fetchedItems = fetchResult[fetchOptions.outputDataPath];

  if (!fetchResult.nextToken) {
    return fetchedItems;
  }

  const recursiveItems = await fetchRecursively(awsClient, {
    ...fetchOptions,
    nextToken: fetchResult.nextToken,
  }, payload);

  return fetchedItems.concat(recursiveItems);
}

function parseAwsTags(tagsInput) {
  if (_.isArray(tagsInput)) {
    validateAwsTags(tagsInput);
    return tagsInput;
  }

  if (_.isPlainObject(tagsInput)) {
    return _.entries(tagsInput).map(mapEntryToAwsTag);
  }

  if (_.isString(tagsInput)) {
    const lines = removeWhitespaceAndSplitLines(tagsInput);
    const parsedLines = lines.map((line) => {
      const [tagKey, ...tagValueSegments] = line.split("=");
      return [tagKey, tagValueSegments.join("=")];
    });
    return parsedLines.map(mapEntryToAwsTag);
  }

  throw new Error(`Tags "${JSON.stringify(tagsInput)}" are in unsupported format. Supported formats are: array, object, string.`);
}

function validateAwsTags(tags) {
  const invalidTag = tags.some((tag) => !tag.Key);
  if (invalidTag) {
    throw new Error(`Tag "${JSON.stringify(invalidTag)}" is in bad AWS format.`);
  }
}

function mapEntryToAwsTag([entryKey, entryValue]) {
  return { Key: entryKey, Value: entryValue };
}


async function resolveJsonConfigurationParam(jsonConfigParam) {
  if (_.isPlainObject(jsonConfigParam)) {
    return jsonConfigParam;
  }
  if (_.isString(jsonConfigParam)) {
    const rawConfig = await tryReadFileContent(jsonConfigParam);

    try {
      return JSON.parse(rawConfig);
    } catch (error) {
      throw new Error(`Failed to parse JSON configuration from file: ${error.message}`);
    }
  }

  throw new Error(`Unsupported JSON Configuration parameter type: ${JSON.stringify(jsonConfigParam)}`);
}

async function tryReadFileContent(filepath) {
  if (!await pathExists(filepath)) {
    throw new Error(`File ${filepath} does not exist!`);
  }

  const pathStat = await lstat(filepath);
  if (!pathStat.isFile()) {
    throw new Error(`Path ${filepath} is not a file`);
  }

  const fileContent = await readFile(filepath);
  return fileContent.toString();
}

async function pathExists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

function mergePipelineConfigurations(originalConfig, newConfig) {
  const mergedConfig = newConfig;

  mergedConfig.pipeline.roleArn = newConfig.pipeline.roleArn || originalConfig.pipeline.roleArn;
  mergedConfig.pipeline.stages = newConfig.pipeline.stages || originalConfig.pipeline.stages;
  mergedConfig.pipeline.artifactStore.artifactsBucket = newConfig.pipeline.artifactStore.artifactsBucket || originalConfig.pipeline.artifactStore.location;
  if (originalConfig.pipeline.artifactStore.encryptionKey) {
    mergedConfig.pipeline.artifactStore.encryptionKey = (
      newConfig.pipeline.artifactStore.encryptionKey || originalConfig.pipeline.artifactStore.encryptionKey
    );
  }

  return mergedConfig;
}

module.exports = {
  parseAwsTags,
  resolveJsonConfigurationParam,
  mergePipelineConfigurations,
  fetchRecursively,
}