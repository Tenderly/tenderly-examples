#!/bin/bash

source CI/.env

ROOT=$(PWD)

check_foundry_repo_clean(){
  cd $FOUNDRY_REPO || echo "Foundry repo not found" && exit 1

  git diff --quiet -- foundry.toml; nochanges=$?
  if [ $nochanges -ne 0 ]; then
      echo "commit or clear changes from foundry.toml"
      exit 1
  fi
}


## Need the chain ID
CHAIN_ID_HEX=$(curl $RPC_URL \
    -X POST \
    -H "Content-Type: application/json" \
    -d '{
      "jsonrpc": "2.0",
      "id": 0,
      "method": "eth_chainId"
}' | jq -r ".result")

# converts hex chain ID to decimal
export CHAIN_ID=$((${CHAIN_ID_HEX}))

echo "Chain ID:" ${CHAIN_ID}

echo "
[etherscan]
unknown_chain = { key = "\"$TENDERLY_ACCESS_KEY\"", chain = $CHAIN_ID, url = "\"$VERIFICATION_URL\"" }
" >> $FOUNDRY_REPO/foundry.toml

cd $ROOT || echo "Bad ROOT directory ${ROOT}" && exit 1

./deploy-command.sh

cd $FOUNDRY_REPO || echo "Bad FOUNDRY_REPO directory ${FOUNDRY_REPO}" && exit 1
git checkout -- foundry.toml

cd $ROOT || echo "Bad ROOT directory ${ROOT}" && exit 1