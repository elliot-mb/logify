<script lang="ts">
  import { loggedIn, userInfo } from "$lib/../stores";

</script>

<a href="/logout" 
  data-sveltekit-preload-data="off" 
  on:click={() => {
    $loggedIn = false;
    $userInfo = null;
  }}> <!--so we dont delete data premtively-->
  <button disabled={!$loggedIn} class="primary">
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