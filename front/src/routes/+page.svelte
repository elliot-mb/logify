<script lang="ts">
  import '../app.css';
  import type { PageData } from './$types';
  import { token } from '../stores';
    import AuthMessage from '$lib/components/AuthMessage.svelte';

  export let data: PageData;

  //those components that must fetch on the client side
  $token = data.token; //used in sub-components which are out of reach

</script>


<h1>Welcome to Logify!</h1>
{#if data.err !== null}
  <h2>Error fetching user content</h2>
  <p>{data.err.message}</p>
{:else if data.user === null || $token === null}
  <AuthMessage/>
{:else} 
  <h2>Hi {data.user.display_name}!</h2>
{/if}
<p>Visit <a href="https://github.com/elliot-mb/logify">this repository</a> to read the documentation and view the source code</p>