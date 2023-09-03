<script lang="ts">
  import "../../app.css";
  import { loggedIn } from "$lib/../stores";
  import Login from "./Button/Login.svelte";
  import Logout from "./Button/Logout.svelte";
  import Banner from "./User/Banner.svelte";
  import NowPlaying from "./NowPlaying.svelte";

</script>

<div class="hero">
  <a href="/"><h1>Logify</h1></a>
    <div style="text-align: right">
      {#if $loggedIn}
        <NowPlaying/>
      {/if}
    </div>
  
  <Banner/>
  <Login/>
  <Logout/>
</div>

<style>
  .hero{
    display: grid;
    grid-template-columns: 7rem 1fr 10rem 9rem 7rem;
    gap: 0.5rem;
    color: var(--light-text);
    height: 4rem;
    padding: 0rem 2rem 0rem 2rem;
    margin-bottom: 2rem;
    background-color: var(--hero);
  }

  h1{
    margin: 0.75rem 0 0 0;
  }
</style>

