<script lang="ts">
  import '../app.css';
  import { loggedIn, token, userInfo } from '$lib/../stores';
  import type { PageData } from './$types';

  export let data: PageData;

  $loggedIn = data.isLoggedIn;
  $userInfo = data.user;
  $token = data.token;

</script>


{#if !$loggedIn}
  <h1>Please log in</h1>
{:else if data.err !== null}
  <h1>Error fetching user content</h1>
  <p>{data.err.message}</p>
{:else if $userInfo !== null} 
  <h1>Hi {$userInfo.display_name}!</h1>
{/if}
<p>Visit <a href="https://github.com/elliot-mb/logify">this repository</a> to read the documentation and view the source code</p>