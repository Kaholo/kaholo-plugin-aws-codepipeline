const { parseAwsTags, resolveJsonConfigurationParam } = require("./helpers")

function prepareCreatePipelinePayload(params) {
  validateStagesParameter(params.stages);

  const artifactStore = {
    location: artifactsBucket,
    type: "S3"
  }
  if (params.encryptionKey) {
    artifactStore.encryptionKey = {
      id: encryptionKey,
      type: "KMS"
    };
  }

  return {
    pipeline: {
      roleArn: params.role,
      name: params.name,
      stages: params.stages,
      artifactStore,
    },
    tags: parseAwsTags(params.tags),
  };
}

function validateStagesParameter(stages) {
  if (!Array.isArray(stages)) {
    throw new Error("\"Stages\" parameter must be an array.");
  }

  const invalidStage = stages.find((stage) => (
    !stage.actions || !stage.actions.length || !stage.name
  ));
  if (invalidStage) {
    throw new Error(`Stage item ${JSON.stringify(invalidStage)} is missing one of the required fields. Each stage must contain at least one action and have a name.`);
  }
}

function prepareUpdatePipelinePayload(params) {
  validateStagesParameter(params.stages);

  const artifactStore = {
    location: artifactsBucket,
    type: "S3",
  }
  if (params.encryptionKey) {
    artifactStore.encryptionKey = {
      id: encryptionKey,
      type: "KMS"
    };
  }

  return payload = {
    pipeline: {
      name: params.pipeline,
      roleArn: params.role,
      stages: params.stages,
      artifactStore,
    }
  }
}

function prepareJsonPipelineRelatedPayload(params) {
  return resolveJsonConfigurationParam(params.pipelineJson);
}

function preparePipelineParameterRelatedPayload(params) {
  return {
    name: params.pipeline
  }
}

module.exports = {
  prepareCreatePipelinePayload,
  prepareCreatePipelineFromJsonPayload,
  prepareUpdatePipelinePayload,
  prepareJsonPipelineRelatedPayload,
  preparePipelineParameterRelatedPayload,
};
