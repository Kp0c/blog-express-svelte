<script>

    export let type = 'text';
    export let label;
    export let id = 'id';
    export let placeholder = undefined;

    export let value = '';

    const handleInput = e => {
      value = type.match(/^(number|range)$/)
        ? +e.target.value
        : e.target.value;
    };
</script>

<div class="flex flex-col w-full">
    {#if label}
        <label
                class="text-md font-semibold text-gray-600"
                for="{id}"
        >
            {label}
        </label>
    {/if}
    <input
            type="{type}"
            id="{id}"
            value="{value}"
            on:input={handleInput}
            placeholder="{placeholder}"
            class="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-lg"
    >
</div>
