<script lang="ts">
  import "../../app.css";
    import { userInfo } from "$lib/../stores";
  import Login from "./Button/Login.svelte";
    import Logout from "./Button/Logout.svelte";
    import Banner from "./User/Banner.svelte";

</script>

<div class="hero">
  <div class="hfill">
    <a href="/"><h1>Logify</h1></a>
    <div class="logins">
      <Banner/>
      <Login/>
      <Logout/>
    </div>
  </div>
</div>

<style>
  .hero{
    height: 4rem;
    padding: 0rem 2rem 0rem 2rem;
    margin-bottom: 2rem;
    background-color: var(--hero);
  }

  h1{
    margin: 0.75rem 0 0 0;
  }

  .logins{
    display: grid;
    grid-template-columns: 10rem 9rem 7rem;
    gap: 0.5rem;
  }
</style>

