import { Contract } from "ethers";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { network } from "hardhat";

export type DeploymentRecord = {
  name: string;
  address: string;
  network: string;
  timestamp?: Date;
};

function readDeployments() {
  type Deployments = Record<string, DeploymentRecord[]>;
  if (!existsSync(".tenderly/deployments.json")) {
    return {} as Deployments;
  }
  const deployments = JSON.parse(
    readFileSync(".tenderly/deployments.json", "utf8").toString()
  ) as unknown as Deployments;
  return deployments;
}

export function deployed(deployment: DeploymentRecord, tag: string = "latest") {
  if (findDeployment(deployment.name, deployment.network, tag)) {
    return;
  }
  deployment.timestamp = new Date();

  const deploymentsOn = findDeployment(deployment.name, tag);
  const deployments = readDeployments();
  if (!deployments[tag]) {
    deployments[tag] = [deployment];
  } else {
    const idx = deployments[tag].findIndex(
      (d) => d.network == deployment.network && d.name == deployment.name
    );
    deployments[tag][idx] = { ...deployments[tag][idx], ...deployment };
  }

  writeFileSync(
    ".tenderly/deployments.json",
    JSON.stringify(deployments, null, 2)
  );
}

export function findDeployment(name: string, network: string, tag = "latest") {
  const deployments = readDeployments()[tag];
  if (!deployments) {
    return undefined;
  }
  return deployments.filter((d) => d.name === name && d.network == network)[0];
}
