<script lang="ts">
  import { onMount } from "svelte";

  let hasToken: boolean = false;

</script>

<a href="/login">
  <button disabled={hasToken} class="primary">
    <h2>Log{hasToken ? 'ged' : ''} in</h2>
  </button>
</a>


<style>
  h2{
    margin: 0;
    padding: 0;
  }
</style>