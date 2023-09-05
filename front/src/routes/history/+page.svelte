<script lang="ts">
  import '$lib/../app.css';
  import type { PageData } from './$types';
  import { Spotify } from '$lib/../spotify';
  import { token } from '$lib/../stores';
  import { onMount } from 'svelte';
    import History from '$lib/components/History.svelte';

  export let data: PageData;

  $token = data.token; //used in sub-components which are out of reach

</script>

<h1>Listening History</h1>

<p>Filter your history and see see simple analytics by time period.</p>

{#if data.history === null}
  <p>Please <a href="/login">login</a> to view your history</p>
{:else}
  <History history={data.history}/>
{/if}
