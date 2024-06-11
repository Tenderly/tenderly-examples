# How to to interact and manage new pools created by the UniswapV3Factory contract using Tenderly Alerts and Web3 Actions

This README provides a comprehensive guide on setting up a Tenderly alert for the `PoolCreated` event emitted by the UniswapV3Factory contract on Ethereum Mainnet, and deploying a Web3Action using the Tenderly CLI to handle the event.

## Prerequisites

- A Tenderly account.
- Access to the Tenderly dashboard.
- A project within Tenderly configured with your Ethereum smart contracts.
- Tenderly CLI installed on your machine.

## Step 1: Creating an Alert in Tenderly

1. **Log into your Tenderly Dashboard.**
2. Navigate to the project where you want to set the alert.
3. Go to the **Alerts** tab and click on **New Alert**.
4. Set the Alert Type to **Event Emitted**.
5. Configure the alert:
    - **Contract Address:** `0x1f98431c8ad98523631ae4a59f267346ea31f984` (UniswapV3Factory contract)
    - **Event Signature:** `PoolCreated(address,indexed address,uint24)`
    - Name your alert appropriately for easy reference.
6. Save the alert.

## Step 2: Setting Up Your `tenderly.yaml` File

Create a `tenderly.yaml` file in the root directory of your local project with the following configuration:

```yaml
account_id: ""
actions:
  account_id/project_slug:
    runtime: v2
    sources: actions
    specs:
      uniswapV3:
        description: "Monitoring UniswapV3 Factory Contract and adding Child/Pool to Contracts page with proper tag"
        function: example:actionFn
        trigger:
          type: alert
          alert: {alert_id}
        execution_type: parallel
project_slug: ""
```

This configuration sets up the deployment details, including the account, action runtime, and the specific alert trigger.

## Step 3: Adding the ACCESS-KEY to Secrets

1. Navigate to the **Web3Actions** page on your Tenderly dashboard.
2. Go to the **Secrets** tab.
3. Add a new secret with the key `ACCESS-KEY` and the value of your actual access key.

## Step 4: Deploying with Tenderly CLI

1. Open a terminal and navigate to your project directory.
2. Run the following command to deploy your actions:

   ```bash
   tenderly actions deploy
   ```

This command deploys your Web3Action as configured in the `tenderly.yaml` file.