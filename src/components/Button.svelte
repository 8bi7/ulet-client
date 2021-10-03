<script>
  import { getContext } from 'svelte';

  export let button;
  // export let onClick;
  const { buttonPress } = getContext('wsContext');
  const handleClick = () => {
    buttonPress(button);
  };
</script>

<button {...$$restProps} on:click={handleClick}>
  <span><slot /></span>
</button>

<style>
  button {
    width: 100%;
    height: 100%;
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    position: relative;
    overflow: hidden;
    cursor: pointer;
    border-radius: calc(min(5vmin, 50px) / 6.25);
    background: var(--theme-background);
    box-shadow: inset 1px 1px 1px rgba(var(--theme-shadow-light-rgb), 0.6),
      inset -1px -1px 1px rgba(var(--theme-shadow-dark-rgb), 0.96),
      -1px -1px 4px 0px rgba(var(--theme-shadow-light-rgb), 0.6),
      -2px -2px 8px 0px rgba(var(--theme-shadow-light-rgb), 0.6),
      1px 1px 4px 0px rgba(var(--theme-shadow-dark-rgb), 0.96),
      2px 2px 8px 0px rgba(var(--theme-shadow-dark-rgb), 0.96);
  }
  button span {
    overflow: hidden;
    white-space: nowrap;
    text-decoration: none;
    text-overflow: ellipsis;
  }
  button:active {
    /* box-shadow: none; */
    background: rgba(var(--theme-shadow-glow-rgb), 0.3);
  }
</style>
