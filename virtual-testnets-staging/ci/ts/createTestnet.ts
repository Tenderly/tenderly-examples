import axios from "axios";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

export async function createTestnet(): Promise<void> {
  const slug: string = `test-${new Date().toISOString().replace(/:/g, "-").slice(0, 19)}`;
  const tenderlyTestnetName: string = slug;
  const purpose: string = process.env.PURPOSE || "development";
  const originalNetworkId: string = process.env.ORIGINAL_NETWORK_ID || "1";
  const blockNumber: string = process.env.BLOCK_NUMBER || "0";
  const chainId: string = process.env.CHAIN_ID || "1";
  const verificationVisibility: string = process.env.VERIFICATION_VISIBILITY || "public";

  const requestBody = {
    slug: slug,
    displayName: tenderlyTestnetName,
    description: "",
    visibility: "TEAM",
    tags: { purpose },
    networkConfig: {
      networkId: originalNetworkId,
      blockNumber: blockNumber,
      chainConfig: { chainId },
      baseFeePerGas: "1",
    },
    explorerConfig: {
      enabled: true,
      verificationVisibility,
    },
    syncState: false,
  };

  const apiUrl: string = `https://api.tenderly.co/api/v1/account/${process.env.TENDERLY_ACCOUNT_ID}/project/${process.env.TENDERLY_PROJECT}/testnet/container`;

  try {
    const response = await axios.post(apiUrl, requestBody, {
      headers: {
        "Content-Type": "application/json",
        "X-Access-Key": process.env.TENDERLY_ACCESS_KEY!,
      },
    });

    const adminRpcUrl = response.data.container.connectivityConfig.endpoints
      .filter((endpoint: any) => endpoint.private)
      .map((endpoint: any) => endpoint.uri)[0];

    console.log(adminRpcUrl);
  } catch (error) {
    console.error("Failed to create testnet:", error);
  }
}
