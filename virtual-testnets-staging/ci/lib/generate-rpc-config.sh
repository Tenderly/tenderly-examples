

TESTNET_RPC=$1
TESTNET_RPC_UUID=$(sed -E "s|https://virtual.mainnet.rpc.tenderly.co/(.*)|\1|" <<< $TESTNET_RPC)

sed -E "s|(https://virtual.mainnet.rpc.tenderly.co/)(.*)([\"|'])(.*)|\1$TESTNET_RPC_UUID\3\4|" $LIB/tenderly.config.template.json \
| sed -E "s|(https://dashboard.tenderly.co/explorer/vnet/)(.*)([\"|'])(.*)|\1$TESTNET_RPC_UUID\3\4|" \
 > $DEPLOYMENTS_DIR/tenderly.config.json

echo "Configuration saved at tenderly.config.json"