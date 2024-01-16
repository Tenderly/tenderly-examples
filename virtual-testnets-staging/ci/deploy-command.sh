#!/bin/bash
PWD
source ./.env

source $LIB/deploy-helpers.sh

source $LIB/create-testnet.sh

export TESTNET_RPC=$(create_testnet)

echo "Deploying to $TESTNET_RPC"

## TODO: Your deployment command here:
## Use forge_create_tenderly or forge_create_tenderly_verify
cd $FOUNDRY_REPO
#forge_create_tenderly Lock --constructor-args 1000000000000000000000
#forge_create_tenderly Counter
join_all_deployments

cd $LIB
generate-rpc-config.sh $TESTNET_RPC

cd $CI || exit 1