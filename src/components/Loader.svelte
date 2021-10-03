<script>
  export let show: boolean = false;
</script>

<div class:loader={show} />

<style>
  .loader {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    animation: spin 2s linear infinite;
    border: 16px solid var(--theme-shadow-dark);
    border-top: 16px solid var(--theme-shadow-glow);
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
