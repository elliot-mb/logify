<script lang="ts">
  import '../app.css';
  import { page } from "$app/stores";
    import Content from '$lib/components/Content.svelte';
  const err: App.Error = $page.error!;
</script>

<Content>
  <h1>{err.status}</h1>
  <h2>{err.message}</h2>
</Content>
