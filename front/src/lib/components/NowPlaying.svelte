<script lang="ts">
    import { Spotify } from "$lib/../spotify";
    import { token, track } from "$lib/../stores";
    import { onMount } from "svelte";

  let currentTrack: Spotify.Track | null = null;
  let currentTrackErr: App.Error | null = null;

  const getNowPlayingCallback: {(): void} = () => {
    if($token !== null)
      Spotify.Get.nowPlaying($token)
        .then(track => {
          if(track !== null && track.is_playing){
            currentTrack = track; //display track
            if(track.fetch_in !== null) //if we are to fetch another update
              setTimeout(getNowPlayingCallback, Math.max(track.fetch_in, Spotify.TRACK_REFRESH_MS));
          }else{
            setTimeout(getNowPlayingCallback, Spotify.TRACK_REFRESH_MS);
          }
        })
        .catch(err => currentTrackErr = err);
  }

  onMount(() => {
    if($token !== null)
      getNowPlayingCallback(); //start recursive chain of calls
  })

  let trackNameWidth: number;
  let pageWidth: number;
  let trackName: string;
  let repeatedNames: string[] = ["unknown"];
  $: {
    trackName = ((): string => {
      if(currentTrack === null || !currentTrack.is_playing){ 
        return 'unknown';
      }else{
        return `
        🎵 ${currentTrack.artists!.join(', ')} — ${currentTrack.name}, 
        💿 ${currentTrack.album},
        ⭐ popularity ${currentTrack.popularity}/100`;
      }
    })();
  }

  $:{ //fill out an array with the right number of names to cover the page and one extra
    if(pageWidth !== undefined && trackNameWidth !== undefined){
      repeatedNames = new Array(1 + Math.ceil(pageWidth / trackNameWidth)).fill(trackName);
    }
  }


  $: $track = currentTrack; 
</script>

{#if currentTrack !== null || currentTrackErr !== null}
  <div class="outer" hidden={currentTrack === null} bind:clientWidth={pageWidth}>
    {#if currentTrackErr !== null && currentTrack !== null} <!--ignore null track error-->
      <span>Error fetching current track: {currentTrackErr.message}</span>
    {:else if currentTrack !== null}
    <!--separate concerns of measuring the length and scrolling-->
      <div 
        class="measurer" 
        bind:clientWidth={trackNameWidth}
        style="--track-name-width: {trackNameWidth}px;" >
        <a href={currentTrack?.url}>
          <span>{trackName}</span>
        </a>
      </div>

      <div 
        class="scroller"
        style="--track-name-width: {trackNameWidth}px; --track-name-width-no-unit: {trackNameWidth};"
      >
        <a href={currentTrack?.url}>
          {#each repeatedNames as name}
            <span>{name}</span>
          {/each}
        </a>
      </div> 
    {/if} 
  </div>
{/if}



<style>
  :root{
    --margin: 2rem;
    --speed: 700;
  }

  .outer{
    position: absolute;
    margin-top: -2rem;
    width: 100vw;
    overflow: hidden;
    background-color: #44444422;
    padding: 1rem 0 1rem 0;
  }

  .measurer{
    position: absolute;
    transform: translate(calc(-2 * var(--track-name-width)));
    white-space: nowrap;
  }

  .scroller{
    animation: calc(15s * (var(--track-name-width-no-unit) / var(--speed))) linear 0s infinite running scroll;
    white-space: nowrap;
  }

  span{
    margin: 0 var(--margin) 0 var(--margin);
  }

  @keyframes scroll {
    from {
      transform: translateX(calc(0.1 * var(--margin)));
    }
    to{
      transform: translateX(calc(-1 * var(--track-name-width)));
    }
  }
</style>