from aws_cdk import (
    Stack,
    Duration,
    aws_lambda as _lambda,
    aws_apigateway as apigateway,
    CfnOutput,
    Stage,
    aws_s3 as s3,
    aws_iam as iam,
    aws_certificatemanager as acm,
    aws_route53 as route53,
    aws_route53_targets as targets,
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
                s3.Bucket.from_bucket_name(
                    self, "ExistingLambdaCodeBucket", "cdk-deploy-ramble"
                ),
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

        certificate = acm.Certificate.from_certificate_arn(
            self,
            "Certificate",
            certificate_arn="arn:aws:acm:us-east-1:208792096778:certificate/9d21131d-c713-425e-b024-cba5f2c72ec0",
        )

        hosted_zone_id = "Z07818983TUCZ3VYMR5DD"
        domain_name = "ramble.quest"

        hosted_zone = route53.HostedZone.from_hosted_zone_attributes(
            self, "HostedZone", hosted_zone_id=hosted_zone_id, zone_name=domain_name
        )

        domain_name_ext = "api"
        domain_name_with_ext = f"{domain_name_ext}." + domain_name

        # Create the API Gateway
        api = apigateway.LambdaRestApi(
            self,
            f"RambleApiApiGateway-{stage_name}",
            handler=api_lambda,
            deploy_options={"stage_name": stage_name},
            domain_name=apigateway.DomainNameOptions(
                domain_name=domain_name_with_ext,
                certificate=certificate,
                security_policy=apigateway.SecurityPolicy.TLS_1_2,
                endpoint_type=apigateway.EndpointType.EDGE,
            ),
            default_cors_preflight_options=apigateway.CorsOptions(
                allow_origins=apigateway.Cors.ALL_ORIGINS,
                allow_methods=apigateway.Cors.ALL_METHODS,
                allow_headers=["*"],
            ),
        )

        route53.ARecord(
            self,
            "ApiRecord",
            record_name=domain_name_ext,
            zone=hosted_zone,
            target=route53.RecordTarget.from_alias(targets.ApiGateway(api)),
        )

        # Export the URL of the API Gateway endpoint
        CfnOutput(self, "ApiGatewayUrl", value=api.url)


class RambleApiAppStage(Stage):
    def __init__(self, scope: Construct, id: str, **kwargs) -> None:
        super().__init__(scope, id, **kwargs)
        RambleApiStack(self, "RambleApiAppStage", **kwargs)
