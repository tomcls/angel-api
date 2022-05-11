#!/bin/bash
# Run go services
# stop, delete and run new dockers instances
# for service countries,regions,municipalities
# Use config from git repo server
# Go to go wks
# build with dockerfile
if [ $# -eq 0 ]
  then
echo "No arguments supplied: ./run.sh {production,dev,tcl,...}"
    exit
fi
env=$1
serviceName=angel-api
APP_ROOT=/data/www/${serviceName}
portOut=3003
portIn=3003
	
cd $APP_ROOT
# Build with dockerfile
docker rm -f ${serviceName}
# Build with dockerfile
docker build --file=${APP_ROOT}"/srv/Dockerfile" \
--build-arg environment=${env} \
-t  node/express .
echo ".............................Build done, execute cmd docker run ${serviceName}"
docker run  --name ${serviceName}  \
-v /data/www/${serviceName}/.env.prod:/usr/src/app/ \
-p ${portOut}:${portIn} \
-it -d --restart always node/express
    
