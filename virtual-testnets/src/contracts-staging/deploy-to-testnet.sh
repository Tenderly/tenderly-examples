#!/bin/bash
## Check git (foundry.toml only)

ROOT=$(PWD)

cd $FOUNDRY_REPO
git diff --quiet -- foundry.toml; nochanges=$?
if [ $nochanges -ne 0 ]; then
    echo "commit or clear changes from foundry.toml"
    exit 1
fi

VERIFICATION_URL=$RPC_URL/verify/etherscan

## Need the chain ID
CHAIN_ID_HEX=`curl $RPC_URL \
    -X POST \
    -H "Content-Type: application/json" \
    -d '{
      "jsonrpc": "2.0",
      "id": 0,
      "method": "eth_chainId"
}' | jq -r ".result"`

CHAIN_ID=$((${CHAIN_ID_HEX}))

echo "
[etherscan]
unknown_chain = { key = "\"$TENDERLY_ACCESS_KEY\"", chain = $CHAIN_ID, url = "\"$VERIFICATION_URL\"" }
" >> $FOUNDRY_REPO/foundry.toml

## Fund the deployer address (test test ... junk mnemonic) using the Unlimited faucet
read -r -d '' REQUEST_PAYLOAD <<EOF
{
  "jsonrpc": "2.0",
  "method": "tenderly_setBalance",
  "params": [
    "$DEPLOYER_ADDRESS",
    "0xDE0B6B3A7640000"
  ],
  "id": "1234"
}
EOF

curl -X POST -H "Content-Type: application/json" "$RPC_URL" -d "$REQUEST_PAYLOAD"

cd $ROOT
./deploy-command.sh

cd $FOUNDRY_REPO
git checkout -- foundry.toml
cd $ROOT