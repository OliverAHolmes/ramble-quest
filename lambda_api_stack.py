from constructs import Construct
from aws_cdk import (
    Stack,
    Duration,
    aws_codecommit as codecommit,
    aws_codebuild as codebuild,
    aws_lambda as _lambda,
    aws_apigateway as apigateway,
    aws_codepipeline as codepipeline,
    aws_codepipeline_actions as codepipeline_actions,
)


class RambleLambdaApiStack(Stack):
    def __init__(self, scope: Construct, id: str, **kwargs) -> None:
        super().__init__(scope, id, **kwargs)


        # CodeBuild Project
        build_project = codebuild.PipelineProject(
            self,
            "FastApiBuild",
            build_spec=codebuild.BuildSpec.from_source_filename("buildspec-local.yml"),
            environment=codebuild.BuildEnvironment(
                build_image=codebuild.LinuxBuildImage.STANDARD_5_0
            ),
        )

        # Lambda Function
        api_lambda = _lambda.Function(
            self,
            "FastApiLambdaFunction",
            runtime=_lambda.Runtime.PYTHON_3_11,
            handler="app.handler",
            code=_lambda.Code.from_cfn_parameters(),  # Will be provided by the pipeline
            memory_size=512,
            timeout=Duration.seconds(30),
        )

        # API Gateway
        # Create the API Gateway
        api = apigateway.LambdaRestApi(
            self,
            f"FastAPIApiGateway",
            handler=api_lambda,
            deploy_options={"stage_name": "dev"},
        )