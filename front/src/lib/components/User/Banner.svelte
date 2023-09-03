<script lang="ts">
  import { userInfo } from "$lib/../stores";
  import type { Spotify } from "$lib/../spotify";

  let pfp: Spotify.ImageObject | null = null;
  $: pfp = $userInfo === null ? null : $userInfo.images[0];
</script>

<div class="display">
  {#if $userInfo !== null && pfp !== null} <!--pfp null check is to make ts happy-->
    <img 
      class="display-image" 
      src={pfp.url} 
      alt="pfp" 
      style="--ratio: {pfp.width / pfp.height}; "/>
    <div class="display-text">{$userInfo.display_name}</div>
  {/if}
</div>

<style> 

  :root{
    --size: 3.5rem;
  }
  .display {
    display: flex;
    flex-direction: row;
    gap: 0rem;
  }
  .display-text{
    font-size:x-large;
    padding: 1rem 1rem 0 1rem;
    color: var(--light-text);
  }
  img{
    margin-top: 0.25rem;
    border-radius: calc(var(--size)/2);
    display: fixed;
    width: calc(var(--size) * var(--ratio));
    height: calc(var(--size) * (1 / var(--ratio)));
  }
</style>