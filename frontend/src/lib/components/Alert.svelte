<script>
  import {Alert} from "flowbite-svelte";
  import {onDestroy, onMount} from "svelte";
  import {removeAlert} from "../stores/alerts.store.js";

  export let type = 'success';
  export let id;

  $: color = type === 'success'
    ? 'green'
    : type === 'error'
    ? 'red'
    : 'blue';

  const TIMEOUT = 5000; // 5 seconds
  let timeout;

  onMount(() => {
    timeout = setTimeout(() => {
      removeAlert(id);
    }, TIMEOUT);
  });

  onDestroy(() => {
    clearTimeout(timeout);
  });
</script>

<Alert color="{color}" closeBtn>
    <span slot="content">
        <slot/>
    </span>
</Alert>
