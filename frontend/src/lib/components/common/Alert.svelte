<script>
  import {onDestroy, onMount} from "svelte";
  import {removeAlert} from "../../stores/alerts.store.js";

  export let type = 'success';
  export let id;

  const commonClasses = 'border-2 p-3 m-3 rounded relative duration-300 ease-in-out';
  $: containerClasses = type === 'success'
    ? 'bg-green-100 border-green-400 text-green-700 ' + commonClasses
    : type === 'error'
      ? 'bg-red-100 border-red-400 text-red-700 ' + commonClasses
      : 'bg-blue-100 border-blue-400 text-blue-700 ' + commonClasses;

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

<div class="{containerClasses}">
  <slot/>
</div>

