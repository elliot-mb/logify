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
          }
        })
        .catch(err => currentTrackErr = err);
  }

  onMount(() => {
    if($token !== null)
      getNowPlayingCallback(); //start recursive chain of calls
  })
</script>


{#if currentTrackErr !== null}
  <p>Error fetching current track</p>
{:else if currentTrack === null}
  <p>🎵 Not currently playing anything</p>
{:else}
  <p>🎵 <em>{currentTrack.artists?.join(', ')}</em>
    — <em>{currentTrack.name}</em>,
    on <em>{currentTrack.album}</em></p>
{/if} 


<style>
  p{
    font-size:large;
    margin: 0.5rem 0 0 0;
  }

  code {
    font-size:larger;
  }
</style>