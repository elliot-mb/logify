<script lang="ts">
  import { onMount } from "svelte";
  import { Spotify } from "$lib/../spotify";
  import { token } from "$lib/../stores";
    import { exposesAppError } from "$lib/../utils";

  let err: App.Error | null = null;
  let history: Spotify.PlayHistory[] | null = null;

  onMount(async () => {
    if($token !== null){
    const historyOrError: Spotify.PlayHistory[] | App.Error = 
      await Spotify.Get.recentlyPlayed($token)(20)
      .catch(e => <App.Error> ({status: e.status, message: e.body.message}));
      if(exposesAppError(historyOrError)){
        err = <App.Error> historyOrError;
      }else{
        history = <Spotify.PlayHistory[]> historyOrError;
      }
    }
  })


</script>

<div class="trackgrid">
  <h3 class="cell">Name</h3>
  <h3 class="cell">Artist(s)</h3>
  <h3 class="cell">Album</h3>
  <h3 class="cell">Played</h3>
  {#if history !== null}
    {#each history as h}
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