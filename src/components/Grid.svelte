<script lang="ts">
  import Grid from 'svelte-grid';
  import Button from './Button.svelte';
  import gridHelp from 'svelte-grid/build/helper/index';

  import { groups } from '../store';

  export let changeGroupState: (group: any) => void;

  const COLS = 5;

  let items = [];

  $: mapItems($groups);
  const mapItems = (groups) => {
    let myId = groups[0].id;
    
    if (!groups.length) return;
    items = groups.map((group) => ({
      [COLS]: gridHelp.item({
        x: 0,
        y: 0,
        w: group.grid.col,
        h: group.grid.row,
        resizable: false,
      }),
      id: group.id,
      data: group,
    }));

    items = gridHelp.adjust(items, COLS);
  };

  const cols = [[1200, COLS]];

  /* 
  function add(group) {
    let newItem = {
      [COLS]: gridHelp.item({
        w: group.grid.row,
        h: group.grid.col,
        x: 0,
        y: 0,
        resizable: false,
      }),
      id: group.id,
      data: group,
    };

    let findOutPosition = gridHelp.findSpace(newItem, items, COLS);

    newItem = {
      ...newItem,
      [COLS]: {
        ...newItem[COLS],
        ...findOutPosition,
      },
    };

    items = [...items, ...[newItem]];

    items = gridHelp.normalize(items, COLS);
  }
  */

  const remove = (item) => {
    items = items.filter((value) => value.id !== item.id);

    items = gridHelp.adjust(items, COLS);
    changeGroupState(item);
  };
</script>

<div class="grid-container">
  <Grid bind:items rowHeight={60} let:item let:dataItem {cols} gap={[5, 5]}>
    <div class="grid-widget" on:click|stopPropagation|preventDefault={() => {}}>
      <span
        on:pointerdown={(e) => e.stopPropagation()}
        on:click={() => remove(dataItem.data)}
        class="remove"
      >
        ✕
      </span>
      <div
        class="grid-item"
        style="grid-template-rows: repeat({dataItem.data.grid
          .row}, 1fr); grid-template-columns: repeat({dataItem.data.grid
          .col}, 1fr);"
      >
        {#each Array.from({ length: dataItem.data.grid.row }, (_, i) => i) as row, i}
          {#each Array.from({ length: dataItem.data.grid.col }, (_, i) => i) as col, j}
            <div
              class="square"
              on:pointerdown|preventDefault|stopPropagation={() => {}}
            >
              {#each Object.values(dataItem.data.buttons) as button, k}
                {#if button.row === i && button.col === j}
                  <Button {button}>{button.name}</Button>
                {/if}
              {/each}
            </div>
          {/each}
        {/each}
        <!-- <p>{dataItem.id}</p> -->
      </div>
    </div>
  </Grid>
</div>

<style>
  .grid-widget {
    background: #f1f1f1;
    height: 100%;
    width: 100%;
    display: flex;
    padding: 20px 0 0;
    position: relative;
    border-radius: var(--radius-small);
  }

  .grid-container {
    max-width: 800px;
    width: 100%;
    color: white;
  }

  .remove {
    top: 3px;
    right: 15px;
    position: absolute;
    cursor: pointer;
    user-select: none;
    color: var(--theme-text-secondary-on-background);
  }
  .grid-item {
    width: 100%;
    height: 100%;
    display: grid;
    grid-gap: 3px;
  }
  .square {
    min-width: 50px;
    padding: 5px;
    border-radius: calc(min(5vmin, 50px) / 6.25);
    background-color: var(--theme-shadow-dark);
  }
</style>
