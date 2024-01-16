#!/bin/bash

cd $FOUNDRY_REPO

## TODO: Your deployment command here:
MAX_SEGMENT_COUNT=3

FOUNDRY_PROFILE=optimized \
forge script script/DeployCore.s.sol \
  --broadcast \
  --rpc-url $RPC_URL \
  --sig "run(address)" \
  --verify \
  --verifier-url $VERIFICATION_URL \
  $ADMIN_ADDRESS
