<script lang="ts">
  import Content from '$lib/components/Content.svelte';
  import Hero from '$lib/components/Hero.svelte';
  import '../app.css';
  import type { PageData } from './$types';
  
  export let data: PageData;

</script>

<Hero/>
<Content>
  {#if !data.isLoggedIn}
    <h1>Please log in</h1>
  {:else if data.err !== null}
    <h1>Error fetching user content</h1>
    <p>{data.err.message}</p>
  {:else if data.user !== null} 
    <h1>Hi {data.user.display_name}!</h1>
  {/if}
  <p>Visit <a href="https://github.com/elliot-mb/logify">this repository</a> to read the documentation and view the source code</p>
</Content>

