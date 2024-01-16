# Node Examples

This section contains examples on usage of Tenderly node via:

- [Ethers 5](ethers-5/)
- [Viem examples](ethers-6/)
- [Viem examples](samples/viem)

## Running the samples 

### Viem

```bash
export TENDERLY_NODE_ACCESS_KEY=#...
cd samples/viem
yarn
node 0-send-tx.mjs  > 0-send-tx.txt
vi 0-send-tx.txt
vi 0-send-tx.mjs
```

### Ethers 5
```bash
export TENDERLY_NODE_ACCESS_KEY=#...
cd ethers-5
yarn
node json-rpc-https-provider.mjs 
```

### Ethers 6
```bash
export TENDERLY_NODE_ACCESS_KEY=#...
cd ethers-6
yarn
node json-rpc-https-provider.mjs 
```


