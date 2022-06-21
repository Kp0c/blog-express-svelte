<script lang="ts">
    import DefaultButton from "./buttons/DefaultButton.svelte";
    import type { color } from "./buttons/buttons-configs";
    import OutlineButton from "./buttons/OutlineButton.svelte";

    export let type: ('solid' | 'outline') = 'solid';
    export let color: color = 'primary';

</script>

{#if type === 'solid'}
    <DefaultButton {color} on:click><slot/></DefaultButton>
{/if}
{#if type === 'outline'}
    <OutlineButton {color} on:click><slot/></OutlineButton>
{/if}
