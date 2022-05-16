const awsPluginLibrary = require("kaholo-aws-plugin-library");
const AWS = require("aws-sdk");
const payloadFunctions = require("./payload-functions");
const { mergePipelineConfigurations, fetchRecursively } = require("./helpers");
const autocomplete = require("./autocomplete");
const { credentialKeys } = require("./consts.json");

const simpleAwsMethods = {
  createPipeline: awsPluginLibrary.generateAwsMethod("createPipeline", payloadFunctions.prepareCreatePipelinePayload),
  createPipelineFromJson: awsPluginLibrary.generateAwsMethod("createPipeline", payloadFunctions.prepareJsonPipelineRelatedPayload),
  updatePipelineFromJson: awsPluginLibrary.generateAwsMethod("updatePipeline", payloadFunctions.prepareJsonPipelineRelatedPayload),
  deletePipeline: awsPluginLibrary.generateAwsMethod("deletePipeline", payloadFunctions.preparePipelineParameterRelatedPayload),
  startPipelineExecution: awsPluginLibrary.generateAwsMethod("startPipelineExecution", payloadFunctions.preparePipelineParameterRelatedPayload),
  getPipeline: awsPluginLibrary.generateAwsMethod("getPipeline", payloadFunctions.preparePipelineParameterRelatedPayload),
  getPipelineState: awsPluginLibrary.generateAwsMethod("getPipelineState", payloadFunctions.preparePipelineParameterRelatedPayload),
};

async function updatePipeline(codePipelineClient, params) {
  let payload = payloadFunctions.prepareUpdatePipelinePayload(params);

  if (params.dontOverride) {
    const existingPipeline = (
      await codePipelineClient.getPipeline({ name: payload.pipeline.name }).promise()
    );
    payload = mergePipelineConfigurations(existingPipeline, payload);
  }

  return codePipelineClient.updatePipeline(payload).promise();
}

async function listPipelines(codePipelineClient) {
  const pipelines = await fetchRecursively(codePipelineClient, {
    methodName: "listPipelines",
    outputDataPath: "pipelines",
  }).catch((error) => {
    throw new Error(`Failed to list pipelines: ${error.message || JSON.stringify(error)}`);
  });

  return { pipelines };
}

module.exports = {
  ...awsPluginLibrary.bootstrap(
    AWS.CodePipeline,
    {
      ...simpleAwsMethods,
      updatePipeline,
      listPipelines,
    },
    {
      listRegions: awsPluginLibrary.autocomplete.listRegions,
      ...autocomplete.CodePipeline,
    },
    credentialKeys,
  ),
  ...awsPluginLibrary.bootstrap(AWS.S3, {}, autocomplete.S3, credentialKeys),
  ...awsPluginLibrary.bootstrap(AWS.IAM, {}, autocomplete.IAM, credentialKeys),
  ...awsPluginLibrary.bootstrap(AWS.KMS, {}, autocomplete.KMS, credentialKeys),
};
