<script lang="ts">
  import { JsonRpcProvider } from '@ethersproject/providers';
  import { ethers } from 'ethers';
  import { writable, type Writable } from 'svelte/store';
  import NetworkConfig from './NetworkConfig.svelte';
  import {
    simulate,
    type MultisigTransaction,
    type TenderlyConfig,
    type TxSimulationOutcome
  } from './tenderly.t';

  let txIndex = 0;

  const multisigFields: (keyof MultisigTransaction)[] = ['from', 'to', 'value', 'data'];

  // Multisig Wallet Address
  let multisigAddress = import.meta.env.VITE_MULTISIG_WALLET;

  let tx: MultisigTransaction = {
    // Funded wallet on the network
    from: '0xDC6bDc37B2714eE601734cf55A05625C9e512461',
    // TicTacToe contract
    to: import.meta.env.VITE_TIC_TAC_TOE,
    value: '0',
    // tic-tac-toe data: join game 1
    data: '0xefaa55a00000000000000000000000000000000000000000000000000000000000000001'
  };

  const txSimulation: Writable<TxSimulationOutcome> = writable({
    status: null,
    url: '',
    message: ''
  });

  let tenderlyConfig: TenderlyConfig = {
    user: import.meta.env.VITE_TENDERLY_USER,
    project: import.meta.env.VITE_TENDERLY_PROJECT,
    fork: {
      rpcUrl: import.meta.env.VITE_FORK_RPC,
      networkId: import.meta.env.VITE_CHAIN_ID
    },
    apiAccessKey: import.meta.env.VITE_TENDERLY_API_KEY,
    gatewayAccessKey: ''
  };

  $: provider = new JsonRpcProvider(tenderlyConfig.fork.rpcUrl);

  async function simulateTx() {
    // switchToTestnetContracts();
    try {
      const params = {
        network_id: tenderlyConfig.fork.networkId.toString(),
        from: tx.from,
        to: tx.to,
        value: ethers.utils.parseUnits(tx.value, 'ether').toHexString(),
        data: tx.data,
        input: tx.data
      };
      console.log('Simulating TX', params);
      txSimulation.set(await simulate(params, tenderlyConfig));
    } catch (e) {
      // @ts-ignore
      if (e.code == 'ACTION_REJECTED') {
        console.log('rejected');
      }
    }
  }

  async function submitTxToMultisig() {
    clearConfirmationIndicators();
    console.log('Submitting');
    const ms = new ethers.Contract(
      multisigAddress,
      ['function submitTransaction(address to, uint256 value, bytes data)'],
      provider.getSigner(0)
    );

    const submission = await ms.submitTransaction(
      tx.to,
      ethers.utils.parseEther(tx.value),
      tx.data
    );

    const receipt = await submission.wait();

    const abi = new ethers.utils.Interface([
      'event TxSubmission(address indexed owner, uint indexed txIndex, address indexed to, uint value, bytes data)'
    ]);

    txIndex = receipt.logs.map((log: any) => abi.parseLog(log))[0].args.txIndex.toString();
  }

  function clearConfirmationIndicators() {
    confirmed0 = false;
    confirmed1 = false;
    confirming0 = false;
    confirming1 = false;
  }

  function switchToTestnetContracts() {
    multisigAddress = import.meta.env.VITE_MULTISIG_WALLET_TESTNET;
    tx.to = import.meta.env.VITE_TIC_TAC_TOE_TESTNET;
  }

  async function confirmTx(idx: number, who: 0 | 1) {
    const ms = new ethers.Contract(
      multisigAddress,
      ['function confirmTransaction(uint256 transactionId)'],
      provider.getSigner(0)
    );

    try {
      const confirmation = await ms
        .connect(provider.getSigner(who))
        .confirmTransaction(idx, { gasLimit: 80000 });
      await confirmation.wait();
      console.log('Confirmed!');
    } catch (e) {
      alert('Failed');
    }
  }

  let confirming0 = false,
    confirming1 = false,
    confirmed0 = false,
    confirmed1 = false;

  const confirmSigner0 = async () => {
    confirming0 = true;
    await confirmTx(txIndex, 0);
    confirming0 = false;
    confirmed0 = true;
    console.log('Confirmed 1');
  };

  const confirmSigner1 = async () => {
    confirming1 = true;
    await confirmTx(txIndex, 1);
    confirming1 = false;
    confirmed1 = true;
    console.log('Confirmed 2');
  };

  async function executeTx(idx: number) {
    const ms = new ethers.Contract(
      multisigAddress,
      ['function executeTransaction(uint256 transactionId)'],
      provider.getSigner(0)
    );

    const execution = await ms.executeTransaction(idx, { gasLimit: 300000 });
    await execution.wait();
    console.log('Executed!');
  }
</script>

<details>
  <summary>Tenderly configuration</summary>
  <NetworkConfig bind:tenderlyConfig />
</details>
<br />
<h2 class="text-xl mb-5">Multisig Transaction</h2>
<form on:submit|preventDefault={simulateTx} method="post">
  <div class="mb-4">
    <label
      for="multisigAddress"
      class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
    >
      Multisig at:
    </label>
    <input
      type="text"
      bind:value={multisigAddress}
      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
    />
  </div>

  <!-- <pre class="text-sm mt-1 mb-5">{multisigAddress}</pre> -->
  <div class="">
    {#each multisigFields as field, i}
      <div class="mb-4">
        <label for={field} class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
          {field}
        </label>

        <input
          type="text"
          bind:value={tx[field]}
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
      </div>
    {/each}
  </div>

  <div class="mb-4 mt-4">
    <button
      type="button"
      class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
      on:click={switchToTestnetContracts}>Use testnet contracts</button
    >
    <button
      type="submit"
      class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
      >Simulate</button
    >

    {#if $txSimulation.status === 'success' || ($txSimulation.status === 'fail' && !!$txSimulation.url)}
      <a
        href={$txSimulation.url}
        target="_blank"
        rel="noreferrer"
        class="text-white bg-gray-500  focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
      >
        {$txSimulation.status === 'success' ? '🟢' : '🔴'}
        View Simulation
      </a>
      {#if !!$txSimulation.message}
        <div class="my-2">
          Failed with error:
          <pre>{$txSimulation.message}</pre>
        </div>
      {/if}
    {/if}

    {#if $txSimulation.status === 'fail' && !$txSimulation.url}
      ❌ It failed: {$txSimulation.message}
    {/if}
  </div>

  <div class="my-10">
    <h2 class="text-xl">Operations</h2>
    <div class="mb-4 mt-4">
      <button
        type="button"
        class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        on:click={submitTxToMultisig}>Submit to to Multisig</button
      >
    </div>

    <label for="txIndex" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
      Tx Index
    </label>
    <input
      type="text"
      name="txIndex"
      bind:value={txIndex}
      class="mb-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
    />
    <button
      type="button"
      class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
      on:click={confirmSigner0}
      >{confirming0 ? '⏳' : confirmed0 ? '✓' : '𐄂'} Confirm by Signer 1</button
    >
    <button
      type="button"
      class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
      on:click={confirmSigner1}
      >{confirming1 ? '⏳' : confirmed1 ? '✓' : '𐄂'} Confirm by Signer 2</button
    >
    <button
      type="button"
      class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
      on:click={() => executeTx(txIndex)}>Execute</button
    >
  </div>
</form>
