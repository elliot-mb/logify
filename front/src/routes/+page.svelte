<script lang="ts">
  import '../app.css';
  import type { PageData } from './$types';
  import { token } from '../stores';

  export let data: PageData;

  //those components that must fetch on the client side
  $token = data.token; //used in sub-components which are out of reach

</script>


{#if data.err !== null}
  <h1>Error fetching user content</h1>
  <p>{data.err.message}</p>
{:else if data.user !== null} 
  <h1>Hi {data.user.display_name}!</h1>
{:else}
  <h1>Please log in</h1>
{/if}
<p>Visit <a href="https://github.com/elliot-mb/logify">this repository</a> to read the documentation and view the source code</p>