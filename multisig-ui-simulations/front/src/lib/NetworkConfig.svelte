<script lang="ts">
  import type { TenderlyConfig } from './tenderly.t';

  // Multisig.svelte sets it up
  export let tenderlyConfig: TenderlyConfig;
</script>

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
    <label for="accessKey">API Access Key</label>
    <input
      type="password"
      id="accessKey"
      bind:value={tenderlyConfig.apiAccessKey}
      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
    />
  </div>
  <div class="mb-6">
    <label for="accessKey">Fork RPC URL</label>
    <input
      type="text"
      id="accessKey"
      bind:value={tenderlyConfig.fork.rpcUrl}
      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
    />
  </div>
  <div class="mb-6">
    <label for="forkNetworkId">Fork Network ID</label>
    <input
      type="text"
      id="forkNetworkId"
      bind:value={tenderlyConfig.fork.networkId}
      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
    />
  </div>
</div>

<style>
</style>
