<script lang="ts">
  export let checkHostIp;
  let value: string = '';
  let error: Boolean = false;

  const handleSubmit = () => {
    if (checkHostIp(value)) {
      error = false;
    } else {
      error = true;
    }
  };
</script>

<div class="input-wrapper" class:error>
  <input type="text" placeholder="host ip" bind:value autofocus />
  <button
    class=""
    on:click={handleSubmit}
    on:keypress={(e) => e.key === 'Enter' && handleSubmit()}
  />
</div>

<style>
  .input-wrapper {
    width: 100%;
    height: 60px;
    display: flex;
    padding: 5px;
    align-items: center;
    justify-content: flex-start;
    border-radius: var(--radius-small);
    background: var(--theme-background);
  }
  .input-wrapper.error {
    border: 1px solid var(--theme-text-error);
  }
  .input-wrapper.error input {
    color: var(--theme-text-error);
  }
  .input-wrapper input {
    width: 80%;
    height: 50px;
    font-size: 1.1rem;
    border: none;
    overflow: hidden;
    background: var(--theme-background);
  }
  .input-wrapper button {
    width: 20%;
    height: 50px;
    border: none;
    /* overflow: hidden; */
    font-size: 1.2rem;
    position: relative;
    background: var(--theme-background);
  }
  .input-wrapper button::after {
    content: '';
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    position: absolute;

    -moz-transition: all 0.3s ease-in-out;
    transition: all 0.3s ease-in-out;
    background: var(--theme-shadow-dark);
    -webkit-clip-path: polygon(
      0 30%,
      50% 30%,
      50% 0,
      100% 50%,
      50% 100%,
      50% 70%,
      0 70%
    );
    clip-path: polygon(
      0 30%,
      50% 30%,
      50% 0,
      100% 50%,
      50% 100%,
      50% 70%,
      0 70%
    );
  }
  .input-wrapper button:hover::after {
    left: 30%;
    right: -30%;
  }
</style>
