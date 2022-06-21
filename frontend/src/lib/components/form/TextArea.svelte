<script>
  export let label;
  export let value = '';
  export let id = 'id';
  export let placeholder = undefined;
</script>

<div class="flex flex-col">
    {#if label}
        <label
                class="text-md font-semibold text-gray-600"
                for="{id}"
        >
            {label}
        </label>
    {/if}
    <textarea
            id="{id}"
            placeholder="{placeholder}"
            bind:value
            class="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-lg"
    ></textarea>
</div>
