reset_deployments(){
  rm -rf $DEPLOYMENTS_DIR
  mkdir -p $DEPLOYMENTS_DIR
}

## Runs forge create command and outputs deployment info in JSON files for further merging
forge_create_tenderly(){
  echo "forge_create_tenderly"
  local CONTRACT_NAME="${1##*:}"
  local DEPLOYMENT_FILE=$CONTRACT_NAME@$CHAIN_ID.json
  echo "Deploying $CONTRACT_NAME @ $CHAIN_ID"
  echo "$@"
  CREATE_OUT=$(forge create "$@" \
    --rpc-url $TENDERLY_VIRTUAL_TESTNET_PUBLIC_RPC \
    --private-key $PRIVATE_KEY \
    --json
  )
  echo $CREATE_OUT > $DEPLOYMENTS_DIR/$DEPLOYMENT_FILE
  jq . $DEPLOYMENTS_DIR/$DEPLOYMENT_FILE
}

## Runs forge create with verification and outputs deployment info in JSON files for further merging
forge_create_tenderly_verify(){
  echo "forge_create_tenderly_verify"
  local CONTRACT_NAME="${1##*:}"
  local DEPLOYMENT_FILE=$CONTRACT_NAME@$CHAIN_ID.json

  echo "Deploying $CONTRACT_NAME"
  echo "$@"
  CREATE_OUT=forge create "$@" \
    --rpc-url $TENDERLY_VIRTUAL_TESTNET_PUBLIC_RPC \
    --private-key $PRIVATE_KEY \
    --json \
    --verify \
    --verifier-url $TENDERLY_VIRTUAL_TESTNET_VERIFIER_URL \
    --etherscan-api-key $TENDERLY_ACCESS_KEY
  echo $DEPLOYMENTS_DIR
    echo $(CREATE_OUT) > "$DEPLOYMENTS_DIR/$DEPLOYMENT_FILE"
    jq . $DEPLOYMENTS_DIR/$DEPLOYMENT_FILE
}

## Joins all deployments into a single json file for further distribution
join_all_deployments(){
  echo "Joining deployment info"
  # Target JSON file
  local OUT_FILE_BASENAME=contract-addresses
  local OUT_FILE="$DEPLOYMENTS_DIR/$OUT_FILE_BASENAME.json"
  local TMP_OUT_FILE="$DEPLOYMENTS_DIR/$OUT_FILE_BASENAME.jsonr"

  rm -f $TMP_OUT_FILE
  rm -f $OUT_FILE

  # Start the JSON array
  echo '{' > "$TMP_OUT_FILE"

  # Append each JSON file content to the array, comma-separated
  first=1
  for file in "$DEPLOYMENTS_DIR"/*.json; do
      filename=$(basename $file)
      CONTRACT_NAME="${filename%.*}"
      echo "$file $filename $CONTRACT_NAME"
      if [[ $first -eq 1 ]]; then
          first=0
      else
          echo ',' >> "$TMP_OUT_FILE"
      fi
      echo "\"$CONTRACT_NAME\": $(cat $file)" >> "$TMP_OUT_FILE"
  done

  # Close the JSON array
  echo '}' >> "$TMP_OUT_FILE"

  # Properly format the JSON output
  jq . "$TMP_OUT_FILE" > temp.json && mv temp.json "$TMP_OUT_FILE"
  mv $TMP_OUT_FILE $OUT_FILE

}

# Funds the $DEPLOYER_ADDRESS with 10^18 wei
function fund_deployer() {
  read -r -d '' SET_BALANCE_PAYLOAD <<EOF
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
    ## Fund the deployer address (test test ... junk mnemonic) using the Unlimited faucet
    curl -X POST -H "Content-Type: application/json" "$RPC_URL" -d "$SET_BALANCE_PAYLOAD"
}