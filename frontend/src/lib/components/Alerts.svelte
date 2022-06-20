<script>
    import {alerts} from '../stores/alerts.store.js';
    import Alert from "./Alert.svelte";


</script>

{#each $alerts as alert}
    <Alert color="red" id="{alert.id}">
        {alert.message}
    </Alert>
{/each}
