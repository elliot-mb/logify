<script lang="ts">
  import { token} from "$lib/../stores";
    import { Spotify } from "$lib/../spotify";
    import { onMount } from "svelte";

  let err: App.Error | null = null;
  let user: Spotify.User | null = null;

  onMount(() => {
      if($token !== null){
        Spotify.Get.userProfile($token)
        .then(u => {
          user = u;
        })
        .catch(e => err = ({status: e.status, message: e.body.message}));
      }
    }
  )


</script>

<a href="/logout" 
  data-sveltekit-preload-data="off"> <!--so we dont delete data premtively-->
  <button 
    disabled={$token === null} 
    class="primary"
    on:click={$token = null}>
    <h2>Log out</h2>
  </button>
</a>

<style>
  button{
    margin-top: 0.55rem;
    padding: 0rem 1rem 0.1rem 1rem;
    height: 2.75rem;
  }

  h2{
    margin: 0;
    padding: 0;
  }
</style>