<script lang="ts" type="module">
  import { writable } from 'svelte/store';

  import { hostIp, groups } from './store';
  import webSocket from './ws';

  import Grid from './components/Grid.svelte';
  import NavBar from './components/NavBar.svelte';
  import { onDestroy, setContext } from 'svelte';

  export let name: string;
  let documentClicked = writable(false);

  const emitClose = (event) => {
    documentClicked.set(true);
  };

  let changeGroupState, buttonPress, wsDisconnect;
  $: handleBodyClass($groups);
  $: $hostIp.length
    ? ({ changeGroupState, buttonPress, wsDisconnect } = webSocket($hostIp))
    : null;

  const handleBodyClass = (groups = null) => {
    if (groups.length) {
      document.body.classList.add('active');
    } else {
      document.body.classList.remove('active');
    }
  };

  setContext('wsContext', {
    buttonPress: (button) => buttonPress(button),
  });

  onDestroy(() => {
    if (typeof wsDisconnect === 'function') wsDisconnect();
  });
</script>

<div id="bgTexture"><div class="blur" /></div>
<NavBar {documentClicked} />
<main on:click={emitClose}>
  <!-- {$groups.length} -->
  {#if $groups?.length}
    <Grid {changeGroupState} />
  {:else}
    <div class="intro">
      <h1>Hello {name}, this quick demo ULet!</h1>
      <p>
        End goal is to create something like Stream Deck where user can bind
        action KeyPress/Key combination or action script Mac(JXA/OSA),
        Win(probably AHK) to simple key and from Phone or Table execute it.
        Example could be change strem overlay or make short clip that will be
        Replay (eg. sport event quick replay of goal), currently only action is
        to open/focus Application and write text, key press / key combination
        but not all keys work.
      </p>
      <p>Works only on LAN but needs internet connection.</p>
      <p>
        🤦‍♂️ doesn't work on Iphone/Ipad right know RFC 1918 (but you need to try)<br
        />
        tested on Mac (Chrome, Firefox, Safari)
      </p>
      <a class="link" href="/">get the app</a>
    </div>
  {/if}
</main>

<style>
  main {
    z-index: 10;
    margin: 0 auto;
    padding: 70px 10px 0;
    position: relative;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
  }
  h1 {
    color: #ff3e00;
    font-weight: 100;
    text-align: center;
  }
  .intro {
    display: flex;
    flex-direction: column;
    justify-content: center;
    max-width: 700px;
  }
  .introList {
    list-style: initial;
  }
  p {
    line-height: 1.9rem;
    text-align: justify;
    color: var(--theme-shadow-light);
  }
  .link {
    width: 200px;
    height: 60px;
    border: none;
    outline: none;
    border-radius: 9px;
    margin: 2vh auto;
    cursor: pointer;
    color: #aaa6;
    font-weight: 500;
    transition: 0.3s;
    display: flex;
    text-align: center;
    text-decoration: none;
    align-items: center;
    justify-content: center;
    text-transform: uppercase;
    /* background-color: rgba(50, 52, 53, 1); */
    background-color: var(--theme-disconnected);
    color: rgba(196, 191, 181, 0.4);
    box-shadow: rgb(34, 35, 35) 0px 5px 20px;
  }

  .link:hover {
    color: var(--theme-shadow-glow);
    box-shadow: rgb(36, 37, 38) 0px 0px 0px;
  }
</style>
