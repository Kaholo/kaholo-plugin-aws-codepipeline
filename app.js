const parsers = require("./parsers");

const CodePipelineService = require('./aws.codepipeline.service');

async function createPipeline(action, settings){
    const { name, role, artifactsBucket, encryptionKey, stages, tags } = action.params;
    const client = CodePipelineService.from(action.params, settings);
    return client.createPipeline({
        name: parsers.string(name),
        role: parsers.autocomplete(role),
        artifactsBucket: parsers.autocomplete(artifactsBucket),
        encryptionKey: parsers.autocomplete(encryptionKey),
        stages: parsers.stages(stages),
        tags: parsers.tags(tags)
    });
}

async function createPipelineFromJson(action, settings){
    const { pipelineJson } = action.params;
    const client = CodePipelineService.from(action.params, settings);
    return client.createPipelineFromJson(parsers.objectOrFromPath(pipelineJson));
}

async function updatePipeline(action, settings){
    const { pipeline, role, artifactsBucket, encryptionKey, stages, dontOverride } = action.params;
    const client = CodePipelineService.from(action.params, settings);
    return client.updatePipeline({
        pipeline: parsers.autocomplete(pipeline),
        role: parsers.autocomplete(role),
        artifactsBucket: parsers.autocomplete(artifactsBucket),
        encryptionKey: parsers.autocomplete(encryptionKey),
        stages: parsers.stages(stages),
        dontOverride: parsers.boolean(dontOverride)
    });
}

async function updatePipelineFromJson(action, settings){
    const { pipelineJson } = action.params;
    const client = CodePipelineService.from(action.params, settings);
    return client.updatePipelineFromJson(parsers.objectOrFromPath(pipelineJson));
}

async function deletePipeline(action, settings){
    const { pipeline } = action.params;
    const client = CodePipelineService.from(action.params, settings);
    return client.deletePipeline({
        pipeline: parsers.autocomplete(pipeline)
    });
}

async function startPipelineExecution(action, settings){
    const { pipeline } = action.params;
    const client = CodePipelineService.from(action.params, settings);
    return client.startPipelineExecution({
        pipeline: parsers.autocomplete(pipeline)
    });
}

async function getPipeline(action, settings){
    const { pipeline } = action.params;
    const client = CodePipelineService.from(action.params, settings);
    return client.getPipeline({
        pipeline: parsers.autocomplete(pipeline)
    });
}

async function getPipelineState(action, settings){
    const { pipeline } = action.params;
    const client = CodePipelineService.from(action.params, settings);
    return client.getPipelineState({
        pipeline: parsers.autocomplete(pipeline)
    });
}

async function listPipelines(action, settings){
    const client = CodePipelineService.from(action.params, settings);
    return client.listPipelines({});
} 

module.exports = {
    createPipeline,
    createPipelineFromJson,
	updatePipeline,
    updatePipelineFromJson,
	deletePipeline,
	startPipelineExecution,
	getPipeline,
	getPipelineState,
	listPipelines,
// Autocomplete Functions
    ...require("./autocomplete")
}