const parsers = require("./parsers");
const AWS = require("aws-sdk");
const {removeUndefinedAndEmpty} = require("./helpers");

module.exports = class CodePipelineService{
    constructor({accessKeyId, secretAccessKey, region}){
        if (!accessKeyId || !secretAccessKey || !region) throw "Didn't provide access key or region!";
        const creds = {accessKeyId, secretAccessKey, region};
        this.creds = creds;
        this.codePipeline = new AWS.CodePipeline(creds);
        this.lightsail = new AWS.Lightsail(creds);
    }

    static from(params, settings){
        return new CodePipelineService({
            accessKeyId: parsers.string(params.accessKeyId || settings.accessKeyId),
            secretAccessKey: params.secretAccessKey || settings.secretAccessKey,
            region: parsers.autocomplete(params.region || settings.region)
        });
    }

    async createPipeline({name, role, artifactsBucket, encryptionKey, stages, tags}){
        if (!name || !role || !artifactsBucket || !stages || !stages.length){
            throw "One of the required parameters wasn't provided.";
        }
        return this.codePipeline.createPipeline(removeUndefinedAndEmpty({
            pipeline: {
                roleArn: role,
                artifactStore: {
                    location: artifactsBucket,
                    type: "S3",
                    encryptionKey: encryptionKey ? {
                        id: encryptionKey,
                        type: "KMS"
                    } : undefined
                },
                name, stages
            },
            tags
        })).promise();
    }

    async createPipelineFromJson(pipelineBody){
        if (!pipelineBody) throw "Must provide pipeline JSON to create the pipeline from.";
        return this.codePipeline.createPipeline(pipelineBody).promise();
    }

    async updatePipeline({pipeline, role, artifactsBucket, encryptionKey, stages, dontOverride}){
        if (dontOverride){
            if (!pipeline || !(role || artifactsBucket || encryptionKey || stages)){
                throw "Must provide pipeline and at least one field to update";
            }
            var orig = await this.getPipeline({pipeline});
            orig = orig.pipeline;
            role = role || orig.roleArn; stages = stages || orig.stages; orig = orig.artifactStore;
            artifactsBucket = artifactsBucket || orig.location;
            if (orig.encryptionKey){
                encryptionKey = encryptionKey || orig.encryptionKey.id;
            }
        }
        else if (!pipeline || !role || !artifactsBucket || !stages || !stages.length){
            throw "One of the required parameters wasn't provided.";
        }
        return this.codePipeline.updatePipeline(removeUndefinedAndEmpty({
            pipeline: {
                name: pipeline,
                roleArn: role,
                artifactStore: {
                    location: artifactsBucket,
                    type: "S3",
                    encryptionKey: encryptionKey ? {
                        id: encryptionKey,
                        type: "KMS"
                    } : undefined
                },
                stages
            }
        })).promise();
    }

    async updatePipelineFromJson(pipelineBody){
        if (!pipelineBody) throw "Must provide pipeline JSON to update the pipeline from.";
        return this.codePipeline.updatePipeline(pipelineBody).promise();
    }

    async deletePipeline({pipeline}){
        if (!pipeline) throw "Must specify pipeline to delete.";
        return this.codePipeline.deletePipeline({name: pipeline}).promise();
    }

    async startPipelineExecution({pipeline}){
        if (!pipeline) throw "Must specify pipeline to execute.";
        return this.codePipeline.startPipelineExecution({name: pipeline}).promise();
    }

    async getPipeline({pipeline}){
        if (!pipeline) throw "Must specify pipeline!";
        return this.codePipeline.getPipeline({name: pipeline}).promise();
    }

    async getPipelineState({pipeline}){
        if (!pipeline) throw "Must specify pipeline!";
        return this.codePipeline.getPipelineState({name: pipeline}).promise();
    }

    async listAll(funcName, outputName, params = {}){
        try {
            var result = await this.codePipeline[funcName](params).promise();
            const items = [result[outputName]];
            while (result.nextToken){
                params.nextToken = result.nextToken;
                result = await this.codePipeline[funcName](params);
                items.push(...result[outputName]);
            }
        }
        catch (error){
            throw `Problem with listing '${outputName}': ${error.message || JSON.stringify(error)}`;
        }
        return items;
    }

    async listRegions(){
        const ec2 = new AWS.EC2(this.creds);
        return ec2.describeRegions({}).promise();
    }

    async listRoles({nextToken}){
        const iam = new AWS.IAM(this.creds);
        return iam.listRoles({Marker: nextToken}).promise();
    }

    async listS3Buckets(){
        const s3 = new AWS.S3(this.creds);
        return s3.listBuckets().promise();
    }

    async listKmsKeys({nextToken}){
        const kms = new AWS.KMS(this.creds);
        return kms.listKeys({Marker: nextToken}).promise();
    }

    async listPipelines({nextToken, listAll}){
        if (listAll) return this.listAll("listPipelines", "pipelines", {nextToken});
        return this.codePipeline.listPipelines({nextToken}).promise();
    }
}
