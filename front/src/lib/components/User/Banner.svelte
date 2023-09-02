<script lang="ts">
  import { userInfo } from "$lib/../stores";
  import type { Spotify } from "$lib/../spotify";
    import { onMount } from "svelte";

  let pfp: Spotify.ImageObject | null = null;
  onMount(() => {
    pfp = $userInfo === null ? null : $userInfo.images[0]; //profile pic
  });
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
    display: fixed;
    width: calc(4rem * var(--ratio));
    height: calc(4rem * (1 / var(--ratio)));
  }
</style>