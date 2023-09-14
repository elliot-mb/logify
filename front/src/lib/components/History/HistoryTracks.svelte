<script lang="ts">
  import type { Spotify } from "$lib/../spotify";
  import { Utils } from "$lib/../utils";

  export let hist: Spotify.PagingHistory | null = null;
  let page: number = 1;
  let rows: number = 50;
  const RECORDS: {(): number} = () => 50; 
  let front: number = 0;

  $: {
    rows;
    front = (page - 1) * rows; //for slicing history records
  }
  
</script>

<h2>Tracks</h2>
<div class="navigate">
  <div class="hfill">
    <button 
      class="primary" 
      disabled={page <= 1}
      on:click={() => { if(page > 1) page--; }}>Last</button>
    <p class="page-num">{page}</p>
    <button 
      class="primary" 
      disabled={page >= RECORDS() / rows}
      on:click={() => { if(page < RECORDS() / rows) page++; }}>Next</button>
  </div>

  <div class="hfill">
    <p>Records per page</p>
    <input type="number" min="1" max="50" list="rowChoices" bind:value={rows}/>
    <datalist id="rowChoices">
      <option>1</option>
      <option>10</option>
      <option>20</option>
      <option>50</option>
    </datalist>
  </div>
</div>

<div class="table trackgrid">
  <h3 class="cell">Name</h3>
  <h3 class="cell">Artist(s)</h3>
  <h3 class="cell">Album</h3>
  <h3 class="cell">Played</h3>
  {#if hist !== null }
    {#each hist.history.slice(front, front + rows) as h}
      <span class="cell">{h.track.name}</span>
      <span class="cell">{h.track.artists === null ? 'Unknown' : h.track.artists.join(', ')}</span>
      <span class="cell">{h.track.album}</span>
      <span class="cell">{Utils.dateStringToReadable(h.played_at)}</span>
    {/each}
  {/if}
</div>

<style>
  .table{
    border-radius: 0.5rem;
    display: grid;
    gap: 0rem;
    background-color: var(--page);
    margin: 1rem 0 4rem 0;
    box-shadow: 0rem 0rem 2rem var(--primary-faded);
  }

  .trackgrid{
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }

  .cell{
    padding: 1rem;
    border-width: 0.1rem;
    border-style: solid none none none;
    border-color: var(--bg);
    margin: 0;
  }

  button{
    margin: 0 0 0 0;
    font-size: 1rem;
    padding: 0.5rem;
    width: 4rem;
  }

  .page-num{
    margin: 0rem 1rem 0rem 1rem;
    padding: 1rem;
    background-color: var(--page);
    border-radius: 0.5rem;
  }

  .navigate{
    display: flex;
    flex-direction: row;
    height: 3rem;
    justify-content:space-between;
  }

  input{
    font-size: 1rem;
    padding: 0.5rem;
    width: 4rem;
    margin-left: 1rem;
    border-radius: 0.5rem;
    border-style: none;
  }
</style>