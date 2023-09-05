<script>

    import Content from "$lib/components/Content.svelte";
    import Hero from "$lib/components/Hero.svelte";
    import { token } from "$lib/../stores";
    import NowPlaying from "$lib/components/NowPlaying.svelte";

</script>

<Hero/>
<div>
  {#if $token !== null}
    <NowPlaying/>
  {/if}
</div>
<Content>
  <slot/>
</Content>