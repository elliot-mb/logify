<script lang="ts">
  import "../../app.css";
  import Login from "./Button/Login.svelte";
  import Banner from "./User/Banner.svelte";

</script>

<div class="hero">
  <a class="title" href="/"><h1>Logify</h1></a>
  <a href="/history"><h2>History</h2></a>
  <a href="/taste"><h2>Taste</h2></a>
  <div class="hfill">
    <Banner/>
    <Login/>
  </div>
</div>

<style>
  .hero{
    display: grid;
    grid-template-columns: 10rem 7rem 7rem 12rem 8rem;
    gap: 0.5rem;
    color: var(--light-text);
    height: 4rem;
    padding: 0rem 1rem 0rem 1rem;
    margin-bottom: 2rem;
    background-color: var(--hero);
  }

  @media screen and (max-width: 799px) {
    .hero{
      grid-template-columns: 2fr 1fr 1fr;
      height: 8rem;
    }
  }

  @media screen and (max-width: 480px) {
    .hero{
      grid-template-columns: 10rem 1fr;
      height: 12rem;
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

