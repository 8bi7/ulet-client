<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import QrScanner from 'qr-scanner';

  import QrScannerWorkerPath from '!!file-loader!../../node_modules/qr-scanner/qr-scanner-worker.min.js';
  import '!!file-loader!../../node_modules/qr-scanner/qr-scanner-worker.min.js.map';
  QrScanner.WORKER_PATH = QrScannerWorkerPath;

  import CameraSwitch from './svg/CameraSwitch.svelte';

  export let checkHostIp;

  let video;
  let camList = [];
  let curCamera;
  let camQrResult: boolean = false;
  let scanner;
  let elWidth;
  let elHeight;
  let showScanArae: boolean = false;

  onMount(() => {
    scanner = new QrScanner(
      video,
      (result) => setResult(result),
      (error) => {
        // console.log(error);
      }
    );

    QrScanner.listCameras(true).then((cameras) => {
      camList = cameras;
      curCamera = cameras.find(
        (camera) =>
          camera.label.toLowerCase().includes('back') ||
          camera.label.toLowerCase().includes('environment')
      );
      switchCamera(curCamera);
    });
  });
  const setResult = (result) => {
    if (checkHostIp(result)) {
      camQrResult = false;
      stopScanning();
    } else {
      camQrResult = true;
    }
  };

  const switchCamera = (camera = null) => {
    if (camera?.label) return scanner.setCamera(camera.id).then(startScanning);

    curCamera = camList.find((camera) => camera.label !== curCamera?.label);

    scanner.setCamera(curCamera.id).then(startScanning);
  };

  const startScanning = () => {
    scanner.start();
    showScanArae = true;
  };

  const stopScanning = () => {
    if (scanner) scanner.stop();
    showScanArae = false;
  };
  onDestroy(() => {
    stopScanning();
  });
</script>

<div class="Qr-Scanner-Component" class:error={camQrResult}>
  <div
    class="video-container"
    bind:clientWidth={elWidth}
    bind:clientHeight={elHeight}
  >
    <video class="video" bind:this={video} />
    {#if scanner?.$canvas}
      <div class="scan-area-backdrop" class:visible={showScanArae}>
        <canvas
          bind:this={scanner.$canvas}
          style="width:{elWidth > elHeight ? 'auto' : '67%'}; height:{elWidth >
          elHeight
            ? '67%'
            : 'auto'}; transform: {elWidth > elHeight ? 'scaleX(-1)' : ''}"
        />
      </div>
    {/if}
    {#if camList.length > 1}
      <div
        class="switch-camera"
        on:click|preventDefault|stopPropagation={switchCamera}
      >
        <CameraSwitch />
      </div>
    {/if}
    {#if camQrResult}
      <div class="result-wrapper">Try again!</div>
    {/if}
  </div>
</div>

<style>
  .Qr-Scanner-Component {
    border-radius: var(--radius-small);
    background: var(--theme-background);
  }
  .Qr-Scanner-Component.error {
    border: 1px solid var(--theme-text-error);
  }

  .video-container {
    width: 100%;
    height: auto;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .video {
    width: 100%;
    position: relative;
    z-index: 10;
  }

  .switch-camera {
    z-index: 30;
    width: 50px;
    height: 50px;
    right: 20px;
    bottom: 20px;
    position: absolute;
  }
  .scan-area-backdrop {
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: 0;
    width: 100%;
    height: auto;
    z-index: 20;
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.5);
    transition: opacity 0.5s 3s ease-in;
  }
  .scan-area-backdrop.visible {
    opacity: 1;
  }

  .result-wrapper {
    opacity: 1;
    z-index: 30;
    width: 100%;
    position: absolute;
    color: var(--theme-text-error);
    animation: popError 0s 3s forwards;
  }

  @keyframes popError {
    to {
      opacity: 0;
    }
  }
</style>
