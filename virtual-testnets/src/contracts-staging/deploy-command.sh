#!/bin/bash

cd $FOUNDRY_REPO || exit
echo $ADMIN_ADDRESS

VERIFICATION_URL=$VIRTUAL_NETWORK_RPC_URL/verify/etherscan

## TODO: Your deployment command here:
FOUNDRY_PROFILE=optimized \
forge script script/DeployCore.s.sol \
  --broadcast \
  --rpc-url $VIRTUAL_NETWORK_RPC_URL \
  --sig "run(address)" \
  --verify \
  --verifier-url $VERIFICATION_URL \
  $ADMIN_ADDRESS
