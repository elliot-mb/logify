<script lang="ts">
  import { token } from "$lib/../stores";

</script>

<a href="/login" data-sveltekit-preload-data="off"> <!--so we dont fetch cookies premtively-->
  <button disabled={$token !== null} class="primary">
    <h2>Log{$token !== null ? 'ged' : ''} in</h2>
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