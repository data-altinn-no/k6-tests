#!/bin/bash

if [ "$#" -ne 3 ]
then
    echo "Usage: $0 [K6-test] [environment] [useToken]"
    echo "Example: $0 postDeployTests.js dev true"
    exit 0
fi

if [[ "${K6_SECRETS}" == "" ]]
then
    K6_SECRETS=$(node loadSecrets.mjs $2 $3)
fi

K6_SECRETS=$K6_SECRETS k6 run $1