#!/bin/bash
# Run go services
# stop, delete and run new dockers instances
# for service countries,regions,municipalities
# Use config from git repo server
# Go to go wks
# build with dockerfile

serviceName=angel-job
APP_ROOT=/data/www/${serviceName}	
cd $APP_ROOT
# Build with dockerfile
docker rm -f ${serviceName}
# Build with dockerfile
docker build --file=${APP_ROOT}"/srv/DockerfileJob" --output type=docker  -t  node/angel-job .

echo ".............................Build done, execute cmd docker run ${serviceName}"

docker run  --name ${serviceName}  \
-it  node/angel-job
    
