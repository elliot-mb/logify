<script lang="ts">
  import { token } from "$lib/../stores";
  import { Spotify } from "$lib/../spotify";
    import { onMount } from "svelte";

  let err: App.Error | null = null;
  let user: Spotify.User | null = null;
  let pfp: Spotify.ImageObject | null = null;

  onMount(() => {
    if($token !== null){
      Spotify.Get.userProfile($token)
      .then(u => {
        user = u;
        pfp = u.images[0];
      })
      .catch(e => err = ({status: e.status, message: e.body.message}));
    }
  })


  
</script>

<div class="display">
  {#if err !== null}
    <span>Error: {err.message}</span>
  {:else if user !== null && pfp !== null} <!--pfp null check is to make ts happy-->
    <img 
      class="display-image" 
      src={pfp.url} 
      alt="pfp" 
      style="--ratio: {pfp.width / pfp.height}; "/>
    <div class="display-text">{user.display_name}</div>
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