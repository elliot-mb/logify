<script lang="ts">
  import "$lib/../app.css";
    import { token } from "$lib/../stores";
  import Login from "./Button/Login.svelte";
  import Banner from "./User/Banner.svelte";

</script>

<div class="hero">
  <a class="title" href="/"><h1>Logify</h1></a>
  <a href="/history"><h2>History</h2></a>
  <a href="/taste"><h2>Taste</h2></a>
  
  {#if $token !== null}
    <div class="to-left">
      <Login/>
    </div>
    <Banner/>
  {:else}
    <div></div>
    <Login/>
  {/if}
</div>

<style>

  .to-left{
    display: grid;
    justify-content: right;
  }

  .hero{
    display: grid;
    grid-template-columns: 8rem 6rem 6rem 1fr 10rem;
    gap: 2rem;
    color: var(--light-text);
    height: 4rem;
    padding: 0rem 1rem 0rem 1rem;
    margin-bottom: 2rem;
    background-color: var(--hero);
  }

  @media screen and (max-width: 799px) {
    .hero{
      grid-template-columns: 10rem 1fr 1fr;
      height: 9rem;
    }
  }

  @media screen and (max-width: 480px) {
    .hero{
      grid-template-columns: 10rem 1fr;
      height: 14rem;
    }
    .title {
      grid-column: 1/3;
    }
  }

  h1{
    margin: 0.75rem 0 0 0;
  }

  h2 {
    margin: 1rem 0 0 0;
  }


</style>

