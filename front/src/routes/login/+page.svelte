<script lang="ts">
  import { page } from "$app/stores";
    import Content from "$lib/components/Content.svelte";
    import Hero from "$lib/components/Hero.svelte";

  const params: URLSearchParams = $page.url.searchParams;
  const code: string | null = params.get('code'); 
  const state: string | null = params.get('state');
  const err: string | null = params.get('error'); //should be null else user rejected request 

</script>

<Hero/>
<Content>
  <h2>Redirected</h2>
  <p>{code}</p>
  <p>{state}</p>
</Content>
