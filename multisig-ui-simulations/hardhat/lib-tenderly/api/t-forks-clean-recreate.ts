import { readFileSync, writeFileSync } from "fs";
import { loadInfra, replaceExistingForkwWith } from "../tenderly-infra";
import { aTenderlyFork, removeFork } from "./tenderly-api";

(async () => {
  const forkUrl =
    process.env.FORK_MODE === "TEST"
      ? process.env.TENDERLY_TEST_FORK_URL
      : process.env.TENDERLY_FORK_URL;

  if (!!forkUrl) {
    const forkId = forkUrl.split("/").reverse()[0];
    console.log("Removing fork", forkId);
    await removeFork(forkId).catch((err) => {
      // console.error(err);
    });
  }
  console.log("Creating a fork");
  console.time("fork");
  const fork = await aTenderlyFork({
    network_id: process.env.TENDERLY_FORK_NETWORK || "5",
    chain_config: {
      chain_id: Number.parseInt(process.env.TENDERLY_FORK_CHAINID || "55"),
    },
    alias: "UI Fork",
  });
  console.timeEnd("fork");

  console.log("Created the fork", fork.id);
  replaceExistingForkwWith(fork);
})().catch();
