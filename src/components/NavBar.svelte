<script lang="ts">
  import { onMount } from 'svelte';
  import { fly } from 'svelte/transition';
  import QrScanner from 'qr-scanner';
  import isIp from 'is-ip';

  import { hostIp, error } from '../store';

  import ScanQrSvg from './svg/ScanQrSvg.svelte';
  import InputSvg from './svg/InputSvg.svelte';
  import MyQrScanner from './QrScanner.svelte';
  import InputHost from './InputHost.svelte';

  export let documentClicked;
  $: closePopups($documentClicked);

  let input: boolean = false;
  let isQrscanner: boolean = false;
  let deviceHasCamera: boolean = false;
  let outAnim = { x: 0, y: -30, duration: 500 };

  onMount(() => {
    QrScanner.hasCamera().then((hasCamera) => {
      return (deviceHasCamera = hasCamera);
    });
  });

  const closePopups = (listener = null) => {
    input = false;
    isQrscanner = false;
    documentClicked.set(false);
  };

  const checkHostIp = (data) => {
    data = data.trim();
    if (isIp(data)) {
      outAnim = { x: 100, y: 0, duration: 500 };
      closePopups();
      hostIp.set(data);
      return true;
    }
    outAnim = { x: 0, y: -30, duration: 500 };
    return false;
  };
</script>

<nav>
  <div class="left">
    <div class="navName">
      <span>U</span><span>L</span><span>e</span><span>t</span>
    </div>
  </div>
  <div class="right" class:data-error={$error.length}>
    {#if $error}
      <div class="tooltip" transition:fly={{ y: -60, duration: 500 }}>
        {$error}
      </div>
    {/if}
    <div
      class="btn btn-hover"
      on:click={() => {
        isQrscanner = false;
        input = !input;
      }}
    >
      <InputSvg />
      {#if input}
        <div
          class="input-host"
          in:fly={{ x: 0, y: -30, duration: 500 }}
          out:fly={outAnim}
          on:click|stopPropagation|preventDefault={() => {}}
        >
          <InputHost {checkHostIp} />
        </div>
      {/if}
    </div>
    <div
      class="btn qr"
      class:btn-hover={deviceHasCamera}
      on:click={() => {
        if (!deviceHasCamera) return;
        input = false;
        isQrscanner = !isQrscanner;
      }}
    >
      {#if deviceHasCamera}
        <ScanQrSvg />
        {#if isQrscanner}
          <div
            class="qrscanner-wrapper"
            transition:fly={{ y: -60, duration: 500 }}
            on:click|preventDefault|stopPropagation={() => {}}
          >
            <MyQrScanner {checkHostIp} />
          </div>
        {/if}
      {/if}
    </div>
  </div>
</nav>

<style>
  nav {
    top: 0;
    left: 0;
    width: 100%;
    height: 70px;
    display: flex;
    padding: 0 40px;
    z-index: 1000;
    position: absolute;
    align-items: center;
    justify-content: space-between;
  }
  .left {
    display: flex;
  }
  .navName {
    color: var(--theme-background);
    font-size: 32px;
    font-weight: 400;
    letter-spacing: 0.4em;
    margin-top: auto;
    margin-bottom: auto;
    padding-top: 9px;
    display: inline;
    white-space: nowrap;
    display: flex;
    transition: 0.5s;
  }
  .navName:hover {
    letter-spacing: calc(4vmax / 1.5);
    transition: 1s;
    cursor: none;
  }
  .navName span:hover {
    color: var(--theme-shadow-glow);
  }

  .right {
    display: flex;
    position: relative;
  }
  .right.data-error {
    border-radius: var(--radius-small);
    border: 1px solid var(--theme-text-error);
  }
  .tooltip {
    right: 0;
    top: 100%;
    width: 200px;
    position: absolute;
    padding: 8px 16px;
    color: var(--theme-text-error);
    border-radius: var(--radius-small);
    border: 1px solid var(--theme-text-error);
  }
  .btn {
    width: 50px;
    height: 50px;
    display: flex;
    cursor: pointer;
    margin-left: 10px;
    position: relative;
    justify-content: center;
  }

  .btn.btn-hover:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 4px;
    background-size: 300% 300%;
  }

  :global(.btn:not(.btn-hover) svg) {
    fill: var(--theme-shadow-dark);
  }

  .btn.btn-hover:hover:after {
    background: linear-gradient(
      120deg,
      var(--theme-shadow-glow),
      var(--theme-shadow-glow)
    );
    animation: frame-enter 1s forwards ease-in-out reverse; /* ,
       gradient-animation 4s ease-in-out; */
  }
  .input-host {
    top: 50px;
    right: -70px;
    width: 270px;
    position: absolute;
  }

  .qrscanner-wrapper {
    top: 50px;
    right: -5vw;
    width: 100%;
    min-width: 90vw;
    position: absolute;
    border-radius: 4px;
    background: var(--theme-background);
  }

  /* motion */
  /* @keyframes gradient-animation {
    0% {
      background-position: 15% 0%;
    }
    100% {
      background-position: 85% 100%;
    }
  } */

  @keyframes frame-enter {
    0% {
      clip-path: polygon(
        0% 100%,
        3px 100%,
        3px 3px,
        calc(100% - 3px) 3px,
        calc(100% - 3px) calc(100% - 3px),
        3px calc(100% - 3px),
        3px 100%,
        100% 100%,
        100% 0%,
        0% 0%
      );
    }
    25% {
      clip-path: polygon(
        0% 100%,
        3px 100%,
        3px 3px,
        calc(100% - 3px) 3px,
        calc(100% - 3px) calc(100% - 3px),
        calc(100% - 3px) calc(100% - 3px),
        calc(100% - 3px) 100%,
        100% 100%,
        100% 0%,
        0% 0%
      );
    }
    50% {
      clip-path: polygon(
        0% 100%,
        3px 100%,
        3px 3px,
        calc(100% - 3px) 3px,
        calc(100% - 3px) 3px,
        calc(100% - 3px) 3px,
        calc(100% - 3px) 3px,
        calc(100% - 3px) 3px,
        100% 0%,
        0% 0%
      );
    }
    75% {
      -webkit-clip-path: polygon(
        0% 100%,
        3px 100%,
        3px 3px,
        3px 3px,
        3px 3px,
        3px 3px,
        3px 3px,
        3px 3px,
        3px 0%,
        0% 0%
      );
    }
    100% {
      -webkit-clip-path: polygon(
        0% 100%,
        3px 100%,
        3px 100%,
        3px 100%,
        3px 100%,
        3px 100%,
        3px 100%,
        3px 100%,
        3px 100%,
        0% 100%
      );
    }
  }
</style>
