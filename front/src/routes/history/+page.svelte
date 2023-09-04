<script lang="ts">
  import '$lib/../app.css';
  import type { PageData } from './$types';
  import { Spotify } from '$lib/../spotify';
  import { token } from '$lib/../stores';
  import { onMount } from 'svelte';

  export let data: PageData;

  $token = data.token; //used in sub-components which are out of reach

</script>

<h1>Listening History</h1>

<p>Filter your history and see see simple analytics by time period.</p>

<div class="trackgrid">
  <h3 class="cell">Name</h3>
  <h3 class="cell">Artist(s)</h3>
  <h3 class="cell">Album</h3>
  <h3 class="cell">Played</h3>
  {#if data.history !== null}
    {#each data.history as h}
      <span class="cell">{h.track.name}</span>
      <span class="cell">{h.track.artists === null ? 'Unknown' : h.track.artists.join(', ')}</span>
      <span class="cell">{h.track.album}</span>
      <span class="cell">{h.played_at}</span>
    {/each}
  {/if}
</div>

<style>
  .trackgrid{
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    gap: 0rem;
    background-color: var(--hero);
    margin: 0 0 2rem 0;
  }

  .cell{
    padding: 1rem;
    border-width: 0.1rem;
    border-style: solid none none none;
    border-color: var(--bg);
    margin: 0;
  }
</style>