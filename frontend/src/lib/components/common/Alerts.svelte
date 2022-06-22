<script>
  import {alerts} from '../../stores/alerts.store.js';
  import Alert from "./Alert.svelte";
</script>

{#each $alerts as alert (alert.id)}
  <Alert type="{alert.type}" id="{alert.id}">
    {alert.message}
  </Alert>
{/each}
