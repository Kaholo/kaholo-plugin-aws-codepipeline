# kaholo-plugin-aws-codepipeline
Kaholo plugin for integration with AWS CodePipeline API.

##  Settings
1. Access key (String) **Required if not in action** - The default Access Key ID to use to authenticate to AWS.
    [Learn More](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html#Using_CreateAccessKey)
2. Secret key (Vault) **Required if not in action** - The default Access Key Secret to use to authenticate to AWS.
    [Learn More](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html#Using_CreateAccessKey)
3. Region (String) **Required if not in action** - The default AWS region to make requests on.
    [Learn More](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-regions-availability-zones.html)

## Method: Create Pipeline
Create a new pipeline.

## Parameters
1. Access key (String) **Required if not in settings** - The Access Key ID to use to authenticate to AWS for this request. [Learn More](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html#Using_CreateAccessKey)
2. Secret key (Vault) **Required if not in settings** - The Access Key Secret to use to authenticate to AWS for this request. [Learn More](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html#Using_CreateAccessKey)
3. Region (Autocomplete) **Required if not in settings** - The AWS region to make this request on. [Learn More](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-regions-availability-zones.html)
4. Name (String) **Required** - The name of the new pipeline to create.
    [Learn More](https://docs.aws.amazon.com/codecommit/latest/userguide/how-to-create-repository.html)
5. Role (Autocomplete) **Required** - A role to assign to the pipeline that allows AWS CodePipeline to act on the user's behalf when interacting with AWS services.
    [Learn More](https://docs.aws.amazon.com/codedeploy/latest/userguide/getting-started-create-service-role.html)
6. Artifacts S3 Bucket (Autocomplete) **Required** - A s3 bucket to store inside all artifacts created from the pipeline.
    [Learn More](https://docs.aws.amazon.com/codepipeline/latest/userguide/tutorials-simple-s3.html#s3-create-s3-bucket)
7. Artifacts Encryption Key (Autocomplete) **Optional** - The encryption key used to encrypt the data in the artifact store. If this is undefined, the default key for Amazon S3 is used.
    [Learn More](https://docs.aws.amazon.com/kms/latest/developerguide/services-s3.html)
8. Stages (Text) **Required** - An array of stages of actions to perform in the pipeline. Can be provided as json string or as an array from code.
    [Learn More](https://docs.aws.amazon.com/codepipeline/latest/userguide/reference-pipeline-structure.html#pipeline-requirements)
9. Tags (Text) **Optional** - If specified, tag the pipeline with the tags specified. Each tag should either be in the format of Key=Value or just Key. To enter multiple values separate each with a new line. Also accepts getting an array of objects in the form of { Key, Value } or { Key }.
    [Learn More](https://docs.aws.amazon.com/codecommit/latest/userguide/how-to-tag-repository.html)

## Method: Create Pipeline From JSON
Create a new pipeline using the provided pipeline parameters JSON object.

## Parameters
1. Access key (String) **Required if not in settings** - The Access Key ID to use to authenticate to AWS for this request. [Learn More](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html#Using_CreateAccessKey)
2. Secret key (Vault) **Required if not in settings** - The Access Key Secret to use to authenticate to AWS for this request. [Learn More](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html#Using_CreateAccessKey)
3. Region (Autocomplete) **Required if not in settings** - The AWS region to make this request on. [Learn More](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-regions-availability-zones.html)
4. Pipeline JSON (Text) **Required** - The pipeline parameters object of the pipeline to create. Can specify either the path of a local json file on your agent, or provide the content of the json as a javascript object from code.
    [Learn More](https://docs.aws.amazon.com/codepipeline/latest/userguide/reference-pipeline-structure.html#pipeline-requirements)

## Method: Update Pipeline
Update the specified pipeline using the given parameters. Unless specified otherwise, updates all fields, even fields not provided(empties them if they exist), with the provided parameter values. Updating the pipeline increases the version number of the pipeline by 1.

## Parameters
1. Access key (String) **Required if not in settings** - The Access Key ID to use to authenticate to AWS for this request. [Learn More](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html#Using_CreateAccessKey)
2. Secret key (Vault) **Required if not in settings** - The Access Key Secret to use to authenticate to AWS for this request. [Learn More](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html#Using_CreateAccessKey)
3. Region (Autocomplete) **Required if not in settings** - The AWS region to make this request on. [Learn More](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-regions-availability-zones.html)
4. Pipeline (Autocomplete) **Required** - The pipeline to update.
    [Learn More](https://docs.aws.amazon.com/codecommit/latest/userguide/how-to-create-repository.html)
5. Role (Autocomplete) **Required if 'Don't Override' is false** - A role to assign to the pipeline that allows AWS CodePipeline to act on the user's behalf when interacting with AWS services.
    [Learn More](https://docs.aws.amazon.com/codedeploy/latest/userguide/getting-started-create-service-role.html)
6. Artifacts S3 Bucket (Autocomplete) **Required if 'Don't Override' is false** - A s3 bucket to store inside all artifacts created from the pipeline.
    [Learn More](https://docs.aws.amazon.com/codepipeline/latest/userguide/tutorials-simple-s3.html#s3-create-s3-bucket)
7. Artifacts Encryption Key (Autocomplete) **Optional** - The encryption key used to encrypt the data in the artifact store. If this is undefined, the default key for Amazon S3 is used.
    [Learn More](https://docs.aws.amazon.com/kms/latest/developerguide/services-s3.html)
8. Stages (Text) **Required if 'Don't Override' is false** - An array of stages of actions to perform in the pipeline. Can be provided as json string or as an array from code.
    [Learn More](https://docs.aws.amazon.com/codepipeline/latest/userguide/reference-pipeline-structure.html#pipeline-requirements)
9. Tags (Text) **Optional** - If specified, tag the pipeline with the tags specified. Each tag should either be in the format of Key=Value or just Key. To enter multiple values separate each with a new line. Also accepts getting an array of objects in the form of { Key, Value } or { Key }.
    [Learn More](https://docs.aws.amazon.com/codecommit/latest/userguide/how-to-tag-repository.html)
10. Don't Override (Boolean) **Optional** - If true, get the original pipeline object and only update the parameters provided in this action. If false update all pipeline fields, all fields not provided will be updated to be empty.

## Method: Update Pipeline From JSON
Update an AWS pipeline using the provided pipeline parameters JSON object.

## Parameters
1. Access key (String) **Required if not in settings** - The Access Key ID to use to authenticate to AWS for this request. [Learn More](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html#Using_CreateAccessKey)
2. Secret key (Vault) **Required if not in settings** - The Access Key Secret to use to authenticate to AWS for this request. [Learn More](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html#Using_CreateAccessKey)
3. Region (Autocomplete) **Required if not in settings** - The AWS region to make this request on. [Learn More](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-regions-availability-zones.html)
4. Pipeline JSON (Text) **Optional** - The pipeline parameters object of the pipeline to update. Can specify either the path of a local json file on your agent, or provide the content of the json as a javascript object from code.
    [Learn More](https://docs.aws.amazon.com/codepipeline/latest/userguide/reference-pipeline-structure.html#pipeline-requirements)

## Method: Delete Pipeline
Delete Pipeline

## Parameters
1. Access key (String) **Required if not in settings** - The Access Key ID to use to authenticate to AWS for this request. [Learn More](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html#Using_CreateAccessKey)
2. Secret key (Vault) **Required if not in settings** - The Access Key Secret to use to authenticate to AWS for this request. [Learn More](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html#Using_CreateAccessKey)
3. Region (Autocomplete) **Required if not in settings** - The AWS region to make this request on. [Learn More](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-regions-availability-zones.html)
4. Pipeline (Autocomplete) **Optional** - The pipeline to delete.
    [Learn More](https://docs.aws.amazon.com/codecommit/latest/userguide/how-to-create-repository.html)

## Method: Begin Pipeline Execution
Begin Pipeline Execution

## Parameters
1. Access key (String) **Required if not in settings** - The Access Key ID to use to authenticate to AWS for this request. [Learn More](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html#Using_CreateAccessKey)
2. Secret key (Vault) **Required if not in settings** - The Access Key Secret to use to authenticate to AWS for this request. [Learn More](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html#Using_CreateAccessKey)
3. Region (Autocomplete) **Required if not in settings** - The AWS region to make this request on. [Learn More](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-regions-availability-zones.html)
4. Pipeline (Autocomplete) **Optional** - The pipeline to execute.
    [Learn More](https://docs.aws.amazon.com/codecommit/latest/userguide/how-to-create-repository.html)

## Method: Get Pipeline
Get Pipeline

## Parameters
1. Access key (String) **Required if not in settings** - The Access Key ID to use to authenticate to AWS for this request. [Learn More](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html#Using_CreateAccessKey)
2. Secret key (Vault) **Required if not in settings** - The Access Key Secret to use to authenticate to AWS for this request. [Learn More](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html#Using_CreateAccessKey)
3. Region (Autocomplete) **Required if not in settings** - The AWS region to make this request on. [Learn More](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-regions-availability-zones.html)
4. Pipeline (Autocomplete) **Optional** - The pipeline to get information about.
    [Learn More](https://docs.aws.amazon.com/codecommit/latest/userguide/how-to-create-repository.html)

## Method: Get Pipeline State
Get Pipeline State

## Parameters
1. Access key (String) **Required if not in settings** - The Access Key ID to use to authenticate to AWS for this request. [Learn More](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html#Using_CreateAccessKey)
2. Secret key (Vault) **Required if not in settings** - The Access Key Secret to use to authenticate to AWS for this request. [Learn More](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html#Using_CreateAccessKey)
3. Region (Autocomplete) **Required if not in settings** - The AWS region to make this request on. [Learn More](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-regions-availability-zones.html)
4. Pipeline (Autocomplete) **Optional** - The pipeline to return information about his and his actions states.
    [Learn More](https://docs.aws.amazon.com/codecommit/latest/userguide/how-to-create-repository.html)

## Method: List Pipelines
List Pipelines

## Parameters
1. Access key (String) **Required if not in settings** - The Access Key ID to use to authenticate to AWS for this request. [Learn More](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html#Using_CreateAccessKey)
2. Secret key (Vault) **Required if not in settings** - The Access Key Secret to use to authenticate to AWS for this request. [Learn More](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html#Using_CreateAccessKey)
3. Region (Autocomplete) **Required if not in settings** - The AWS region to make this request on. [Learn More](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-regions-availability-zones.html)
