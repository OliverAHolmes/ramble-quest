FROM public.ecr.aws/lambda/python:3.11

# Copy function code
ADD serving_api.tar.gz ${LAMBDA_TASK_ROOT}

RUN pip3 install -r requirements.txt --target ${LAMBDA_TASK_ROOT}

CMD [ "serving_api.lambda_handler" ]