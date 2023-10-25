import os

from aws_cdk import (
    Stack,
    pipelines,
    aws_s3 as s3,
    aws_iam as iam,
    aws_codebuild as codebuild,
    RemovalPolicy,
)
from constructs import Construct

from infrastructure.api_stack import RambleApiAppStage


class LambdaPipelineStack(Stack):
    def __init__(self, scope: Construct, id: str, **kwargs) -> None:
        super().__init__(scope, id, **kwargs)

        deploy_bucket = s3.Bucket(self, "DeployBucket", bucket_name="cdk-deploy-ramble")
        deploy_bucket.apply_removal_policy(RemovalPolicy.DESTROY)

        code_build_role = iam.Role(
            self,
            "CodePipelineRole",
            assumed_by=iam.ServicePrincipal("codebuild.amazonaws.com"),
        )

        code_build_role.add_to_policy(
            iam.PolicyStatement(
                actions=["s3:GetObject", "s3:PutObject"],
                resources=[deploy_bucket.bucket_arn + "/*"],
            )
        )

        repo = pipelines.CodePipelineSource.connection(
            connection_arn="arn:aws:codestar-connections:ap-southeast-2:208792096778:connection/2419a415-8a53-4a39-a416-e64d3273b380",
            branch="main",
            repo_string="OliverAHolmes/ramble-quest",
        )

        pipeline = pipelines.CodePipeline(
            self,
            "Pipeline",
            synth=pipelines.ShellStep(
                "Synth",
                input=repo,
                commands=[
                    "cd infrastructure",
                    "npm install -g aws-cdk",  # Installs the cdk cli on Codebuild
                    "pip install -r requirements.txt",  # Instructs Codebuild to install required packages
                    "npx cdk synth",
                ],
                primary_output_directory="infrastructure/cdk.out",
            ),
            docker_enabled_for_synth=True,
            docker_enabled_for_self_mutation=True,
        )

        # Add a new stage to the pipeline
        dev_stage = pipeline.add_stage(
            RambleApiAppStage(self, "FastAPIAppDev", stage_name="dev")
        )

        # Use the CodeBuild project in the CodeBuildStep
        create_lambda_zip_step = pipelines.CodeBuildStep(
            "CreateLambdaZip",
            input=repo,
            commands=[
                "cd ./backend",
                "pip install -r requirements.txt -t .",
                "zip -r lambda_package.zip .",
                f"aws s3 cp lambda_package.zip s3://{deploy_bucket.bucket_name}",
            ],
            role=code_build_role,
        )

        # Add the ShellStep as a pre-step to your app stage
        dev_stage.add_pre(create_lambda_zip_step)

        # Add the ShellStep as a pre-step to your app stage
        test_stage = pipeline.add_stage(RambleApiAppStage(self, "FastAPIAppTest", stage_name="test"))

        test_stage.add_pre(
            pipelines.ManualApprovalStep("PromoteToTest")
        )

