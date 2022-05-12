const awsPluginLibrary = require("kaholo-aws-plugin-library");
const AWS = require("aws-sdk");
const payloadFunctions = require("./payload-functions");
const { mergePipelineConfigurations, fetchRecursively } = require("./helpers");
const autocomplete = require("./autocomplete");

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
  });

  return { pipelines };
}

module.exports = awsPluginLibrary.bootstrap(
  AWS.CodePipeline,
  {
    ...simpleAwsMethods,
    updatePipeline,
    listPipelines,
  },
  {
    listRegions: awsPluginLibrary.autocomplete.listRegions,
    ...autocomplete,
  },
  {
    ACCESS_KEY: "accessKeyId",
    SECRET_KEY: "secretAccessKey",
    REGION: "region",
  },
);
