import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { createClient, http } from "viem";
import { vMainnet } from "../tenderly.config";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

const viemClient = createClient({
  chain: vMainnet,
  transport: http(),
});

app.get("/", async (req: Request, res: Response) => {
  const blockNumber = await viemClient.request({ method: "eth_blockNumber" });
  res.json({
    blockNumber,
    // TODO: add something contract specific
  });
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});