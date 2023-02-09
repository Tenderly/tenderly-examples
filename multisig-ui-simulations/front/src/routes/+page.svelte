<script>
  import Multisig from '$lib/Multisig.svelte';

  let c = 2;
  function fn() {
    return c * 2;
  }
</script>

<div class="container">
  <Multisig />
</div>

<style>
  .container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px 20px;
  }
</style>
