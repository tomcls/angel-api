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
portIn=3000
	
cd $APP_ROOT
# Build with dockerfile
docker rm -f ${serviceName}
# Build with dockerfile
docker build --no-cache --file=${APP_ROOT}"/srv/Dockerfile" --build-arg environment=${env} -t  node/angel .

echo ".............................Build done, execute cmd docker run ${serviceName}"

docker run  --name ${serviceName}  \
-v /data/www/${serviceName}/.env.prod:/usr/src/app/ \
-v /data/www/${serviceName}/public/images:/usr/src/app/public/images \
-v /data/www/${serviceName}/public/drugs:/usr/src/app/public/drugs \
-p ${portOut}:${portIn} \
-it -d --restart always node/angel
    
