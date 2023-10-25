import os

from aws_cdk import (
    Stack,
    pipelines,
    aws_s3 as s3,
    RemovalPolicy,
)
from constructs import Construct

from infrastructure.api_stack import RambleApiAppStage


class LambdaPipelineStack(Stack):
    def __init__(self, scope: Construct, id: str, **kwargs) -> None:
        super().__init__(scope, id, **kwargs)

        self.deploy_bucket = s3.Bucket(self, "DeployBucket", bucket_name='cdk-deploy')
        self.deploy_bucket.policy.apply_removal_policy(RemovalPolicy.DESTROY)

        pipeline = pipelines.CodePipeline(
            self,
            "Pipeline",
            synth=pipelines.ShellStep(
                "Synth",
                input=pipelines.CodePipelineSource.connection(
                    connection_arn="your-connection-arn",
                    branch="branch-name",
                    repo_string="owner/repo-name",
                ),
                commands=[
                    "cd cdk",
                    "npm install -g aws-cdk",  # Installs the cdk cli on Codebuild
                    "pip install -r requirements.txt",  # Instructs Codebuild to install required packages
                    "npx cdk synth",
                ],
                primary_output_directory="cdk/cdk.out",
            ),
            docker_enabled_for_synth=True,
            docker_enabled_for_self_mutation=True,
        )

        # Add a new stage to the pipeline
        app_stage = pipeline.add_stage(
            RambleApiAppStage(self, "FastAPIAppDev", stage_name="dev")
        )

        # Add a pre-step to the stage to create the zip for deployment.


        app_stage.add_pre(
            pipelines.ShellStep(
                "CreateLambdaZip",
                commands=[
                    "cd ../backend",
                    "zip -r lambda_package.zip .",
                    f"aws s3 cp lambda_package.zip s3://{self.deploy_bucket.bucket_name}/ramble"
                ],
            )
        )
