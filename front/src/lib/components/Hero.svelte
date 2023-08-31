<script lang="ts">
  import "../../app.css";
    import Login from "./Button/Login.svelte";
</script>

<div class="hero">
  <div class="hfill">
    <a href="/"><h1>Logify</h1></a>
    <Login/>
  </div>
</div>

<style>
  .hero{
    padding: 1rem 2rem 1rem 2rem;
    margin-bottom: 2rem;
    background-color: var(--hero);
  }

  h1{
    margin: 0.75rem 0 0 0;
  }
</style>

