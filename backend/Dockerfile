ARG FUNCTION_DIR="/function"

FROM public.ecr.aws/docker/library/python:3.11-bookworm as build-image

ARG FUNCTION_DIR

RUN apt-get update --allow-insecure-repositories && \
    apt-get install -y software-properties-common

RUN echo "deb http://ppa.launchpad.net/ubuntugis/ppa/ubuntu focal main" > /etc/apt/sources.list.d/ubuntugis-ppa.list && \
    apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 6B827C12C2D425E227EDCA75089EBE08314DF160 && \
    apt-get install -y gdal-bin libgdal-dev cmake && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

RUN wget https://github.com/OSGeo/gdal/releases/download/v3.6.4/gdal-3.6.4.tar.gz && \
    tar -xzvf gdal-3.6.4.tar.gz && \
    cd gdal-3.6.4 && \
    mkdir build && \
    cd build && \
    cmake .. && \
    cmake --build . && \
    cmake --build . --target install

ENV LD_LIBRARY_PATH=/usr/local/lib:$LD_LIBRARY_PATH \
    GDAL_DATA=/usr/local/share/gdal

RUN mkdir -p ${FUNCTION_DIR}

COPY . ${FUNCTION_DIR}

COPY requirements.txt ${FUNCTION_DIR}

RUN cd ${FUNCTION_DIR} && pip install --target ${FUNCTION_DIR} -r requirements.txt

ENV \
    GDAL_DATA=/usr/local/share/gdal \
    GDAL_CONFIG=/usr/local/bin/gdal-config \
    LD_LIBRARY_PATH=/usr/local/lib:$LD_LIBRARY_PATH

RUN pip install \
    --target ${FUNCTION_DIR} \
    awslambdaric

RUN pip install --target ${FUNCTION_DIR} GDAL==$(gdal-config --version) 

FROM public.ecr.aws/docker/library/python:3.11-bookworm

ARG FUNCTION_DIR

ENV \
    GDAL_DATA=/usr/local/share/gdal \
    GDAL_CONFIG=/usr/local/bin/gdal-config \
    LD_LIBRARY_PATH=/usr/local/lib:$LD_LIBRARY_PATH

WORKDIR ${FUNCTION_DIR}

COPY --from=build-image ${FUNCTION_DIR} ${FUNCTION_DIR}

ENTRYPOINT [ "/usr/local/bin/python", "-m", "awslambdaric" ]

CMD [ "lambda_handler.lambda_handler" ]