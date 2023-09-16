<script lang="ts">
  import '$lib/../app.css';
  import type { PageData } from './$types';
  import { Spotify } from '$lib/../spotify';
  import { token, track } from '$lib/../stores';
  import { onMount } from 'svelte';
  import AuthMessage from '$lib/components/AuthMessage.svelte';
  import { Utils } from '$lib/../utils';
    import HistoryInference from '$lib/components/History/HistoryInference.svelte';
    import HistoryTracks from '$lib/components/History/HistoryTracks.svelte';

  export let data: PageData;
  let history: Spotify.PagingHistory | null = null;
  let err: App.Error | null = null;

  $token = data.token; //used in sub-components which are out of reach

  //let history: 

  const fetchHistory: {(): void} = async () => {
    if(data.token !== null){
      const historyOrError = await Spotify.Get.recentlyPlayed(data.token)(50)
        .catch(e => <App.Error> ({status: e.status, message: e.message}));

      if(Utils.exposesAppError(historyOrError)){
        err = <App.Error> historyOrError;
      }else{
        history = <Spotify.PagingHistory> historyOrError;
      }
    }
  }

  onMount(() => {
    fetchHistory();
  })

  $: {
    $track; //depend on current track, change history with it
    fetchHistory();
    console.log('refetch history');
  }

  $: {
    history;
    console.log('detected update');
  }

</script>

<h1>Listening History</h1>

<p>Filter and see simple analytics on your recent listening history.</p>

{#if $token === null}
  <AuthMessage/>
{:else}
  <HistoryInference hist={history}/>
  <HistoryTracks hist={history}/>
{/if}

