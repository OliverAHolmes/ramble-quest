from aws_cdk import (
    Stack,
    Duration,
    aws_lambda as _lambda,
    aws_apigateway as apigateway,
    CfnOutput,
    Stage,
    aws_s3 as s3,
    aws_iam as iam,
)
from constructs import Construct
import datetime


class RambleApiStack(Stack):
    def __init__(self, scope: Construct, id: str, **kwargs) -> None:
        # Extract stage_name from kwargs
        stage_name = kwargs.pop("stage_name", None)

        # Ensure stage_name is provided
        if not stage_name:
            raise ValueError("stage_name must be provided in kwargs")

        super().__init__(scope, id, **kwargs)

        # Create the Lambda function, use Existing LambdaCode Bucket
        api_lambda = _lambda.Function(
            self,
            f"RambleApiLambda-{stage_name}",
            code=_lambda.Code.from_bucket(
                s3.Bucket.from_bucket_name(self, "ExistingLambdaCodeBucket", "cdk-deploy-ramble"),
                key="lambda_package.zip",
            ),
            function_name=f"RambleApiLambda-{stage_name}",
            runtime=_lambda.Runtime.PYTHON_3_11,
            handler="lambda_handler.lambda_handler",
            timeout=Duration.seconds(15),
            description=f"Deployed on {datetime.datetime.now()}",
            environment={
                "REGION_NAME": "ap-southeast-2",
                "COGNITO_POOL_ID": "ap-southeast-2_RnWOCBotg",
            },
        )

        # Create the API Gateway
        api = apigateway.LambdaRestApi(
            self,
            f"RambleApiApiGateway-{stage_name}",
            handler=api_lambda,
            deploy_options={"stage_name": stage_name},
        )

        # Export the URL of the API Gateway endpoint
        CfnOutput(self, "ApiGatewayUrl", value=api.url)


class RambleApiAppStage(Stage):
    def __init__(self, scope: Construct, id: str, **kwargs) -> None:
        super().__init__(scope, id, **kwargs)
        RambleApiStack(self, "RambleApiAppStage", **kwargs)
