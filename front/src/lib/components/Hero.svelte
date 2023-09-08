<script lang="ts">
  import "../../app.css";
  import Login from "./Button/Login.svelte";
  import Banner from "./User/Banner.svelte";

</script>

<div class="hero">
  <a href="/"><h1>Logify</h1></a>
  <a href="/history"><h2>History</h2></a>
  <a href="/taste"><h2>Taste</h2></a>
  <div></div>
  <Banner/>
  <Login/>
</div>

<style>
  .hero{
    display: grid;
    grid-template-columns: 10rem 7rem 7rem 2fr 12rem 8rem;
    gap: 0.5rem;
    color: var(--light-text);
    height: 4rem;
    padding: 0rem 1rem 0rem 1rem;
    margin-bottom: 2rem;
    background-color: var(--hero);
  }

  h1{
    margin: 0.75rem 0 0 0;
  }

  h2 {
    margin: 1rem 0 0 0;
  }


</style>

