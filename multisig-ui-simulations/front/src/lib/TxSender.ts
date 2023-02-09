<script lang="ts">
  import { ethers } from 'ethers';
  import { onMount } from 'svelte';
  import { writable, type Writable } from 'svelte/store';

  let name = 'something';
  const ethersProvider = writable();
  const txSimulation: Writable<{ status: null | 'success' | 'fail'; url?: string }> = writable({
    status: null,
    url: ''
  });

  let tenderlyConfig = {
    user: 'nenad',
    project: 'observer',
    accessKey: 'c6ALxqh0EPvMwvn9HTXdEjQT9SfHYk06'
  };

  type Tx = {
    from: string;
    to: string;
    value: string;
    data: string;
  };

  let tx: Tx = {
    from: '',
    to: '0x82d8Cfd5D3789ea35FF4AE5228d2A50AF15F8112',
    value: '0',
    data: ''
  };

  $: priceHex = ethers.utils.parseEther(tx.value).toHexString();

  type TTx = (keyof Tx)[];
  const fields: TTx = ['from', 'to', 'value', 'data'];

  async function init() {
    // @ts-ignore
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send('eth_requestAccounts', []);
    const signer = provider.getSigner();
    ethersProvider.set(provider);
    tx.from = await signer.getAddress();
  }

  async function submit() {
    // @ts-ignore
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send('eth_requestAccounts', []);
    const signer = provider.getSigner();
    tx.from = await signer.getAddress();
    try {
      const params = {
        network_id: '5',
        from: tx.from,
        to: tx.to,
        value: ethers.utils.parseUnits(tx.value, 'ether').toHexString()
      };
      console.log(JSON.stringify(params));

      simulate(params);
    } catch (e) {
      // @ts-ignore
      if (e.code == 'ACTION_REJECTED') {
        console.log('rejected');
      }
    }
    // console.log(response)
  }
  onMount(init);

  async function simulate(params: Tx) {
    try {
      const ret = await fetch(
        `https://api.tenderly.co/api/v1/account/${tenderlyConfig.user}/project/${tenderlyConfig.project}/simulate`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Access-Key': tenderlyConfig.accessKey
          },
          body: JSON.stringify({ ...params, save_if_fails: true, save: true, saveIfFails: true })
        }
      );
      const sim = await ret.json();
      const simId = sim.simulation.id;

      const simUrl = `https://dashboard.tenderly.co/${tenderlyConfig.user}/${tenderlyConfig.project}/simulator/${simId}`;
      txSimulation.set({ status: 'success', url: simUrl });
    } catch (e) {
      txSimulation.set({ status: 'fail' });
    }
  }
</script>

<h2>Multisig {name}</h2>

<div class="py-4">
  <h2 class="text-xl">Tenderly config</h2>
  <div class="mb-6">
    <label for="user">User</label>
    <input
      type="text"
      id="user"
      bind:value={tenderlyConfig.user}
      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
    />
  </div>
  <div class="mb-6">
    <label for="project">Project</label>
    <input
      type="text"
      id="project"
      bind:value={tenderlyConfig.project}
      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
    />
  </div>
  <div class="mb-6">
    <label for="accessKey">Access Key</label>
    <input
      type="password"
      id="accessKey"
      bind:value={tenderlyConfig.accessKey}
      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
    />
  </div>
</div>

<h2 class="text-xl">Multisig data</h2>
<form on:submit|preventDefault={submit} method="post">
  {#each fields as field}
    <div class="mb-6">
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
  <button
    type="submit"
    class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
    >Simulate</button
  >
</form>

{#if $txSimulation.status === 'success'}
  <a
    href={$txSimulation.url}
    target="_blank"
    rel="noreferrer"
    class="text-white bg-gray-500  focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
    >✅ View simulation</a
  >
{/if}

{#if $txSimulation.status === 'fail'}
  ❌ It failed
{/if}

<style>
</style>
