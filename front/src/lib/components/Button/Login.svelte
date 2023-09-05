<script lang="ts">
  import { token } from "$lib/../stores";
  import { tick } from "svelte";

</script>

{#if $token === null}
  <a href="/login" data-sveltekit-preload-data="off">
    <button class="primary"><h2>Log in</h2></button>
  </a>
{:else}
  <a href="/logout" data-sveltekit-preload-data="off">
    <button class="primary" on:click={() => {$token = null;}}><h2>Log out</h2></button>
  </a>
{/if}

<style>
  button{
    margin-top: 0.55rem;
    padding: 0rem 1rem 0.1rem 1rem;
    height: 2.75rem;
    width: 8rem;
  }

  h2{
    margin: 0;
    padding: 0;
  }
</style>