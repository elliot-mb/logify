<script lang="ts">
    import { Spotify } from "$lib/../spotify";
    import { token } from "$lib/../stores";
    import { onMount } from "svelte";

  let currentTrack: Spotify.Track | null = null;
  let currentTrackErr: App.Error | null = null;

  const getNowPlayingCallback: {(): void} = () => {
    if($token !== null)
      Spotify.Get.nowPlaying($token)
        .then(track => {
          if(track.is_playing){
            currentTrack = track; //display track
            if(track.fetch_in !== null) //if we are to fetch another update
              setTimeout(getNowPlayingCallback, track.fetch_in);
          }else{
            setTimeout(getNowPlayingCallback, Spotify.TRACK_REFRESH);
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
        return `${currentTrack.artists!.join(', ')}
        — ${currentTrack.name}, on ${currentTrack.album}`;
      }
    })();
  }

  $:{ //fill out an array with the right number of names to cover the page and one extra
    if(pageWidth !== undefined && trackNameWidth !== undefined){
      repeatedNames = new Array(1 + Math.ceil(pageWidth / trackNameWidth)).fill(trackName);
    }
  }

</script>


<div class="outer" bind:clientWidth={pageWidth}>
  {#if currentTrackErr !== null}
    <p>Error fetching current track: {currentTrackErr.message}</p>
  {:else if currentTrack !== null}
  <!--separate concerns of measuring the length and scrolling-->
    <div 
      class="measurer" 
      bind:clientWidth={trackNameWidth}
      style="--track-name-width: {trackNameWidth}px;" >
      <a href={currentTrack?.url}>
        <span>🎵 <em>{trackName}</em></span>
      </a>
    </div>

    <div 
      class="scroller"
      style="--track-name-width: {trackNameWidth}px;"
    >
      <a href={currentTrack?.url}>
        {#each repeatedNames as name}
          <span>🎵 <em>{name}</em></span>
        {/each}
      </a>
    </div> 
  {/if} 
</div>



<style>
  .outer{
    position: absolute;
    margin-top: -2rem;
    width: 100vw;
    overflow: hidden;
    background-color: #44444422;
  }

  .measurer{
    position: absolute;
    transform: translate(calc(-2 * var(--track-name-width)))
  }

  .scroller{
    animation: 6s linear 0s infinite running scroll;
    white-space: nowrap;
  }

  code {
    font-size:larger;
  }

  span{
    margin: 0 1rem 0 1rem;
  }

  @keyframes scroll {
    from{
      transform: translateX(calc(-1 * var(--track-name-width)));
    }

    to {
      transform: translateX(0px);
    }
  }
</style>