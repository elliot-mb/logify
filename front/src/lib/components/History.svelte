<script lang="ts">
  import { onMount } from "svelte";
  import { Spotify } from "$lib/../spotify";
  import { token } from "$lib/../stores";
  import { Utils } from "$lib/../utils";
  import '$lib/../app.css';

  let b: Utils.Backoffer = new Utils.Backoffer(1000, 2, 4000);

  let err: App.Error | null = null;
  let pager: Spotify.PagingHistory | null = null;

  let rows: number = 10; //bound to records per page input
  const max: number = 50;
  let page: number = 1; // what page are we on
  let canLast: boolean = false; 
  let canNext: boolean = false;

  $: canLast = page > 1;
  $: canNext = page < Math.ceil(max / rows); //last page with some records on

  $: {
    rows;
    if(rows !== undefined && rows >= 1 && rows <= 50){
      b.act(() => {
        getPreviousPage();
        page = 1;
      });
    }
  }

  /**
   * Gets a new page of history records or pages existing records of pager is 
   * not null. Is previous if isPrevious is true. If isPrevious is null fetch 
   * the original page.
   */
  const getPreviousPage: {(isPrevious?: boolean): Promise<void>} = async (isPrevious): Promise<void> => {

    let feedNext: number | undefined = undefined; //what we feed into the function if pager is defined
    let feedPrevious: number | undefined = undefined;
    if(pager !== null && isPrevious !== undefined){
      page += isPrevious ? 1 : -1;
      feedNext = isPrevious ? undefined : pager.next;
      feedPrevious = isPrevious ? pager.previous : undefined;
    }
    if($token !== null){
      const historyOrError: Spotify.PagingHistory | App.Error = 
        await Spotify.Get.recentlyPlayed($token)(
          rows, feedNext, feedPrevious)
        .catch(e => <App.Error> ({status: e.status, message: e.message}));

      if(Utils.exposesAppError(historyOrError)){
        err = <App.Error> historyOrError;
      }else{
        pager = <Spotify.PagingHistory> historyOrError;
      }
    }
  }

  onMount(async () => {
    getPreviousPage(); //boolean here doesnt matter as we dont expect that pager is defined
  })


</script>

<div class="navigate">
  <div class="hfill">
    <button 
      class="primary" 
      disabled={!canLast}
      on:click={() => { b.act(() => getPreviousPage(false)); }}>Last</button>
    <p class="page-num">{page}</p>
    <button 
      class="primary" 
      disabled={!canNext}
      on:click={() => { b.act(() => getPreviousPage(true)); }}>Next</button>
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

<div class="trackgrid">
  {#if err !== null}
    <h3 class="loading cell">could not fetch history: {err.message}</h3>
  {:else}
    <h3 class="cell">Name</h3>
    <h3 class="cell">Artist(s)</h3>
    <h3 class="cell">Album</h3>
    <h3 class="cell">Played</h3>
    {#if pager !== null }
      {#each pager.history as h}
        <span class="cell">{h.track.name}</span>
        <span class="cell">{h.track.artists === null ? 'Unknown' : h.track.artists.join(', ')}</span>
        <span class="cell">{h.track.album}</span>
        <span class="cell">{Utils.dateStringToReadable(h.played_at)}</span>
      {/each}
    {:else}
      <span class="loading cell" style="--rows:{rows};">Fetching</span>
    {/if}
  {/if}
</div>

<style>
  .trackgrid{
    border-radius: 0.5rem;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    gap: 0rem;
    background-color: var(--page);
    margin: 1rem 0 4rem 0;
    box-shadow: 0rem 0rem 2rem var(--primary-faded);
  }

  .cell{
    padding: 1rem;
    border-width: 0.1rem;
    border-style: solid none none none;
    border-color: var(--bg);
    margin: 0;
  }

  .loading {
    grid-column: 1 / 5;
    text-align: center;
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