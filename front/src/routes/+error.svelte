<script lang="ts">
  import '../app.css';
  import { page } from "$app/stores";
  const err: App.Error = $page.error!;
</script>


<h1>{err.status}</h1>
<h2>{err.message}</h2>

