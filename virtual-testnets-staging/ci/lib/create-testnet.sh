#!/bin/bash



create_testnet(){
  # Set the slug
  SLUG="test-$(date '+%Y-%m-%d--%H-%M-%S')"
  TENDERLY_TESTNET_NAME=$SLUG

  # Prepare the JSON payload
  read -r -d '' REQUEST_PAYLOAD <<EOF
  {
    "slug": "$SLUG",
    "displayName": "$TENDERLY_TESTNET_NAME",
    "description": "",
    "visibility": "TEAM",
    "tags": {
      "purpose": "$PURPOSE"
    },
    "networkConfig": {
      "networkId": "$ORIGINAL_NETWORK_ID",
      "blockNumber": "$BLOCK_NUMBER",
      "chainConfig": {
        "chainId": "${CHAIN_ID}"
      },
      "baseFeePerGas": "1"
    },
    "explorerConfig": {
      "enabled": true,
      "verificationVisibility": "$VERIFICATION_VISIBILITY"
    },
    "syncState": false
  }
EOF

  # Prepare API URL and headers
  API_URL="https://api.tenderly.co/api/v1/account/$TENDERLY_ACCOUNT_ID/project/$TENDERLY_PROJECT/testnet/container"
  CONTENT_TYPE="Content-Type: application/json"
  ACCESS_KEY="X-Access-Key: $TENDERLY_ACCESS_KEY"

  # Make the POST request
  RESPONSE=$(curl -s -X POST "$API_URL" -H "$CONTENT_TYPE" -H "$ACCESS_KEY" -d "$REQUEST_PAYLOAD")

  # Extract and print the private RPC URI
  ADMIN_RPC_URL=$(echo $RESPONSE | jq -r '.container.connectivityConfig.endpoints[] | select(.private==true) | .uri')

  echo $ADMIN_RPC_URL
}