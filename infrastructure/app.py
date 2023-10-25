#!/usr/bin/env python3

import aws_cdk as cdk

from infrastructure.lambda_pipeline_stack import LambdaPipelineStack
# from lambda_api_stack import RambleLambdaApiStack


app = cdk.App()
LambdaPipelineStack(app, "LambdaPipelineStack", env=cdk.Environment(region="ap-southeast-2"))
# RambleLambdaApiStack(app, "RambleLambdaApiStack")

app.synth()
