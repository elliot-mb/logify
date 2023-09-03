<script>

    import Content from "$lib/components/Content.svelte";
    import Hero from "$lib/components/Hero.svelte";
    import { loggedIn } from "$lib/../stores";
    import NowPlaying from "$lib/components/NowPlaying.svelte";

</script>

<Hero/>
<div>
  {#if $loggedIn}
    <NowPlaying/>
  {/if}
</div>
<Content>
  <slot/>
</Content>