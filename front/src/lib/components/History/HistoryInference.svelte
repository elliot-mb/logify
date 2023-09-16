<script lang="ts">
  import type { Spotify } from "$lib/../spotify";
  import { Utils } from "$lib/../utils";

  export let hist: Spotify.PagingHistory | null = null;
  let topN: number = 5;
  let topNTracks: [number, Spotify.Track][] = [];
  let topNArtists: [number, string][] = [];
  let topNAlbumsBy: [number, [string, string]][] = [];

  const getTracks: {(): Spotify.Track[]} = (): Spotify.Track[] => 
    hist === null ? []: hist.history.map(h => h.track);

  const getTopNTracks: {(n: number): [number, Spotify.Track][]} = (n): [number, Spotify.Track][] => 
    hist === null ? [] : Utils.countTracks(getTracks()).slice(0, n); 

  const getTopNArtists: {(n: number): [number, string][]} = (n): [number, string][] => 
    hist === null ? [] : Utils.countStrings(Utils.flatten(getTracks().map(t => (t.artists ?? ['unknown'])))).slice(0, n);

  const getTopNAlbums: {(n: number): [number, string][]} = (n): [number, string][] => 
    hist === null ? [] : Utils.countStrings(getTracks().map(t => t.album ?? 'unknown')).slice(0, n);

  /**
   * the top n albums with their artist appended
   */
  const getTopNAlbumsBy: {(n: number): [number, [string, string]][]} = (n): [number, [string, string]][] => {
    const topAlbums: [number, string][] = getTopNAlbums(n);
    const whoBy: {[album: string]: string} = {};
    getTracks().map(t => {
      whoBy[t.album ?? 'unknown'] = (t.artists ?? ['unknown'])[0];
    });
    return topAlbums.map(albumCount => [albumCount[0], [albumCount[1], whoBy[albumCount[1]]]])
  }

  $: {
    hist;
    topNTracks = getTopNTracks(topN);
    topNArtists = getTopNArtists(topN);
    topNAlbumsBy = getTopNAlbumsBy(topN);
  }

</script>


<div class="summaries">
  <div>
    <h2>Top recently played</h2>
    {#if hist !== null}
      <div class="table topgrid4">
        <h3 class="cell">#</h3>
        <h3 class="cell">Name</h3>
        <h3 class="cell">Artists</h3>
        <h3 class="cell">Plays</h3>
        {#each topNTracks as trackCount, i}
          <div class="cell">#{i + 1}</div>
          <div class="cell">{trackCount[1].name}</div>
          <div class="cell">{trackCount[1].artists === null ? 'unknown' : trackCount[1].artists.join(', ')}</div>
          <div class="cell">{trackCount[0]}</div>
        {/each}
      </div>
    {/if}
  </div>

  <div>
    <h2>Top artists</h2>
    {#if hist !== null}
      <div class="table topgrid3">
        <h3 class="cell">#</h3>
        <h3 class="cell">Artist</h3>
        <h3 class="cell">Songs</h3>
        <!--{#each Utils.countStrings(Utils.uniqueTracks(pager.history.map(h => h.track)).map(t => (t.artists ?? ['unknown'])).reduce((xss, xs) => [...xss, ...xs], [])) as t, i}-->
        {#each topNArtists as artistCount, i}
          <div class="cell">#{i + 1}</div>
          <div class="cell">{artistCount[1]}</div>
          <div class="cell">{artistCount[0]}</div>
        {/each}
      </div>
    {/if}
  </div>

  <div>
    <h2>Top albums</h2>
    {#if hist !== null}
      <div class="table topgrid4">
        <h3 class="cell">#</h3>
        <h3 class="cell">Name</h3>
        <h3 class="cell">Artist</h3>
        <h3 class="cell">Songs</h3>
        {#each topNAlbumsBy as albumCount, i}
          <div class="cell">#{i + 1}</div>
          <div class="cell">{albumCount[1][0]}</div> <!--album name-->
          <div class="cell">{albumCount[1][1]}</div> <!--artist whom album belongs-->
          <div class="cell">{albumCount[0]}</div>
        {/each}
      </div>
    {/if}
  </div>
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

  .summaries{
    display: grid;
    gap: 2rem;
    grid-template-columns: 1fr 1fr 1fr;
  }

  @media screen and (max-width: 1299px) {
    .summaries{
      grid-template-columns: 1fr 1fr;
    }
  }

  @media screen and (max-width: 899px) {
    .summaries{
      grid-template-columns: 1fr;
    }
  }

  .topgrid3{
    grid-template-columns: 2rem 2fr 1fr;
  }

  .topgrid4{
    grid-template-columns: 2rem 2fr 2fr 1fr; 
  }
  
  .cell{
    padding: 1rem;
    border-width: 0.1rem;
    border-style: solid none none none;
    border-color: var(--bg);
    margin: 0;
  }

</style>